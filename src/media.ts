import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ffmpegPath, ffprobePath, runBinary } from "./ffmpeg.js";
import { AssetInventorySchema, type Asset, type AssetInventory, type FrameSample } from "./schemas.js";
import {
  copyWithUniqueName,
  ensureProjectExists,
  fromWorkspacePath,
  getFileSize,
  listFiles,
  readProjectConfig,
  resetDirectory,
  toWorkspacePath,
  writeJson
} from "./storage.js";
import { imageExtensions, videoExtensions } from "./taxonomy.js";

type MediaType = "image" | "video";

type ProbeResult = {
  durationSec?: number;
  width: number;
  height: number;
  fps?: number;
};

type FfprobeJson = {
  streams?: Array<{
    codec_type?: string;
    width?: number;
    height?: number;
    avg_frame_rate?: string;
    r_frame_rate?: string;
  }>;
  format?: {
    duration?: string;
  };
};

export async function importMedia(project: string, sourceDir: string): Promise<number> {
  const paths = await ensureProjectExists(project);
  const absoluteSource = path.resolve(sourceDir);
  const files = await listFiles(absoluteSource);
  let imported = 0;

  for (const file of files) {
    if (!getMediaType(file)) {
      continue;
    }
    await copyWithUniqueName(file, paths.rawAssetsDir);
    imported += 1;
  }

  return imported;
}

export async function analyzeMedia(project: string, frameIntervalSec: number): Promise<AssetInventory> {
  await readProjectConfig(project);
  const paths = await ensureProjectExists(project);
  await resetDirectory(paths.frameSheetsDir);

  const files = await listFiles(paths.rawAssetsDir);
  const assets: Asset[] = [];
  const frameSamples: FrameSample[] = [];

  for (const file of files) {
    const fileType = getMediaType(file);
    if (!fileType) {
      continue;
    }

    const asset = await buildAsset(file, fileType);
    assets.push(asset);

    if (fileType === "video") {
      frameSamples.push(
        ...(await extractFrames(asset, paths.frameSheetsDir, frameIntervalSec))
      );
    }
  }

  const inventory = AssetInventorySchema.parse({
    projectId: project,
    generatedAt: new Date().toISOString(),
    assets,
    frameSamples
  });

  await writeJson(paths.inventoryPath, inventory);
  return inventory;
}

function getMediaType(filePath: string): MediaType | undefined {
  const ext = path.extname(filePath).toLowerCase();
  if (imageExtensions.has(ext)) {
    return "image";
  }
  if (videoExtensions.has(ext)) {
    return "video";
  }
  return undefined;
}

async function buildAsset(filePath: string, fileType: MediaType): Promise<Asset> {
  const metadata = await probeMedia(filePath);
  const relativePath = toWorkspacePath(filePath);

  return {
    id: makeAssetId(relativePath),
    filePath: relativePath,
    fileType,
    originalName: path.basename(filePath),
    extension: path.extname(filePath).toLowerCase(),
    sizeBytes: await getFileSize(filePath),
    durationSec: fileType === "video" ? metadata.durationSec : undefined,
    width: metadata.width,
    height: metadata.height,
    fps: fileType === "video" ? metadata.fps : undefined,
    metadata: {
      relativePath
    }
  };
}

async function probeMedia(filePath: string): Promise<ProbeResult> {
  const { stdout } = await runBinary(ffprobePath, [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=codec_type,width,height,avg_frame_rate,r_frame_rate",
    "-of",
    "json",
    filePath
  ]);

  const parsed = JSON.parse(stdout) as FfprobeJson;
  const stream =
    parsed.streams?.find((candidate) => candidate.codec_type === "video") ??
    parsed.streams?.[0];

  if (!stream?.width || !stream.height) {
    throw new Error(`Could not read dimensions for ${filePath}`);
  }

  const duration = Number(parsed.format?.duration);

  return {
    durationSec: Number.isFinite(duration) && duration >= 0 ? duration : undefined,
    width: stream.width,
    height: stream.height,
    fps: parseFps(stream.avg_frame_rate) ?? parseFps(stream.r_frame_rate)
  };
}

function parseFps(value: string | undefined): number | undefined {
  if (!value || value === "0/0") {
    return undefined;
  }

  const [numerator, denominator] = value.split("/").map(Number);
  if (!Number.isFinite(numerator)) {
    return undefined;
  }
  if (!Number.isFinite(denominator) || denominator === 0) {
    return numerator;
  }
  return numerator / denominator;
}

async function extractFrames(
  asset: Asset,
  frameSheetsDir: string,
  frameIntervalSec: number
): Promise<FrameSample[]> {
  const assetDir = path.join(frameSheetsDir, asset.id);
  await mkdir(assetDir, { recursive: true });

  const timestamps = buildTimestamps(asset.durationSec ?? 0, frameIntervalSec);
  const samples: FrameSample[] = [];
  const sourcePath = fromWorkspacePath(asset.filePath);

  for (let index = 0; index < timestamps.length; index += 1) {
    const timestamp = timestamps[index];
    const imagePath = path.join(assetDir, `frame_${String(index + 1).padStart(4, "0")}.jpg`);

    await runBinary(ffmpegPath, [
      "-y",
      "-ss",
      timestamp.toFixed(3),
      "-i",
      sourcePath,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      imagePath
    ]);

    samples.push({
      assetId: asset.id,
      timestampSec: Number(timestamp.toFixed(3)),
      imagePath: toWorkspacePath(imagePath),
      frameIndex: index
    });
  }

  const sheetPath = await createFrameSheet(asset.id, samples, frameSheetsDir);
  return samples.map((sample) => ({ ...sample, sheetPath: toWorkspacePath(sheetPath) }));
}

function buildTimestamps(durationSec: number, intervalSec: number): number[] {
  const safeInterval = Math.max(intervalSec, 0.5);
  if (!Number.isFinite(durationSec) || durationSec <= 0.1) {
    return [0];
  }

  const timestamps: number[] = [];
  for (let timestamp = 0; timestamp < durationSec; timestamp += safeInterval) {
    timestamps.push(Math.min(timestamp, Math.max(durationSec - 0.05, 0)));
  }

  return timestamps.length > 0 ? timestamps : [0];
}

async function createFrameSheet(
  assetId: string,
  samples: FrameSample[],
  frameSheetsDir: string
): Promise<string> {
  const thumbWidth = 320;
  const labelHeight = 34;
  const gap = 12;
  const columns = Math.min(3, Math.max(samples.length, 1));
  const rendered = await Promise.all(
    samples.map(async (sample) => {
      const image = sharp(fromWorkspacePath(sample.imagePath)).resize({
        width: thumbWidth,
        withoutEnlargement: true
      });
      const { data, info } = await image.jpeg({ quality: 88 }).toBuffer({
        resolveWithObject: true
      });
      return { sample, data, width: info.width, height: info.height };
    })
  );

  const cellHeight =
    labelHeight + Math.max(...rendered.map((item) => item.height), 1);
  const rows = Math.ceil(rendered.length / columns);
  const sheetWidth = columns * thumbWidth + (columns + 1) * gap;
  const sheetHeight = rows * cellHeight + (rows + 1) * gap;
  const composites: sharp.OverlayOptions[] = [];

  for (let index = 0; index < rendered.length; index += 1) {
    const item = rendered[index];
    const column = index % columns;
    const row = Math.floor(index / columns);
    const left = gap + column * (thumbWidth + gap);
    const top = gap + row * (cellHeight + gap);

    composites.push({
      input: labelSvg(
        thumbWidth,
        labelHeight,
        `${String(item.sample.frameIndex + 1).padStart(2, "0")}  ${formatTimestamp(
          item.sample.timestampSec
        )}`
      ),
      left,
      top
    });
    composites.push({
      input: item.data,
      left: left + Math.floor((thumbWidth - item.width) / 2),
      top: top + labelHeight
    });
  }

  const sheetPath = path.join(frameSheetsDir, `${assetId}_sheet.jpg`);
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 3,
      background: "#111111"
    }
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(sheetPath);

  return sheetPath;
}

function labelSvg(width: number, height: number, text: string): Buffer {
  const safeText = text.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#202020"/>
      <text x="10" y="23" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">${safeText}</text>
    </svg>
  `);
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${remaining.toFixed(1).padStart(4, "0")}`;
}

function makeAssetId(relativePath: string): string {
  return `asset_${createHash("sha1").update(relativePath).digest("hex").slice(0, 10)}`;
}
