import { constants as fsConstants } from "node:fs";
import { access, copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProjectConfigSchema, type ProjectConfig } from "./schemas.js";
import { type Platform } from "./taxonomy.js";

export const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

export type ProjectPaths = {
  project: string;
  projectDir: string;
  rawAssetsDir: string;
  outputDir: string;
  frameSheetsDir: string;
  configPath: string;
  inventoryPath: string;
};

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

export function requireString(
  args: Record<string, string | boolean>,
  key: string
): string {
  const value = args[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required --${key}`);
  }
  return value.trim();
}

export function optionalNumber(
  args: Record<string, string | boolean>,
  key: string,
  fallback: number
): number {
  const value = args[key];
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`--${key} must be a number`);
  }
  return parsed;
}

export function resolveProjectPaths(project: string): ProjectPaths {
  if (!/^[a-zA-Z0-9_-]+$/.test(project)) {
    throw new Error("Project name can only contain letters, numbers, underscores, and hyphens");
  }

  const projectDir = path.join(workspaceRoot, "projects", project);
  const outputDir = path.join(workspaceRoot, "outputs", project);

  return {
    project,
    projectDir,
    rawAssetsDir: path.join(projectDir, "raw_assets"),
    outputDir,
    frameSheetsDir: path.join(outputDir, "frame_sheets"),
    configPath: path.join(projectDir, "project.json"),
    inventoryPath: path.join(outputDir, "asset_inventory.json")
  };
}

export async function createProject(
  name: string,
  platform: Platform,
  targetDays: number
): Promise<void> {
  const paths = resolveProjectPaths(name);
  await mkdir(paths.rawAssetsDir, { recursive: true });
  await mkdir(paths.outputDir, { recursive: true });

  const config: ProjectConfig = {
    name,
    platform,
    targetDays,
    createdAt: new Date().toISOString()
  };

  await writeJson(paths.configPath, ProjectConfigSchema.parse(config));
}

export async function readProjectConfig(project: string): Promise<ProjectConfig> {
  const paths = resolveProjectPaths(project);
  const json = await readJson(paths.configPath);
  return ProjectConfigSchema.parse(json);
}

export async function ensureProjectExists(project: string): Promise<ProjectPaths> {
  const paths = resolveProjectPaths(project);
  await access(paths.configPath, fsConstants.R_OK).catch(() => {
    throw new Error(`Project ${project} does not exist. Run project:init first.`);
  });
  return paths;
}

export async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(filePath: string, value: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value, "utf8");
}

export async function exists(filePath: string): Promise<boolean> {
  return access(filePath, fsConstants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function copyWithUniqueName(source: string, targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });

  const parsed = path.parse(source);
  let candidate = path.join(targetDir, parsed.base);
  let suffix = 1;

  while (await exists(candidate)) {
    candidate = path.join(targetDir, `${parsed.name}_${suffix}${parsed.ext}`);
    suffix += 1;
  }

  await copyFile(source, candidate);
  return candidate;
}

export async function resetDirectory(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

export async function getFileSize(filePath: string): Promise<number> {
  return (await stat(filePath)).size;
}

export function toWorkspacePath(filePath: string): string {
  return path.relative(workspaceRoot, filePath).split(path.sep).join("/");
}

export function fromWorkspacePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(workspaceRoot, filePath);
}
