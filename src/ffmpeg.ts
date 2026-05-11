import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type StaticPathModule = string | { path?: string } | null;

function loadStaticPath(packageName: string): string {
  const value = require(packageName) as StaticPathModule;
  const binaryPath = typeof value === "string" ? value : value?.path;

  if (!binaryPath) {
    throw new Error(`Could not resolve ${packageName}`);
  }

  return binaryPath;
}

export const ffmpegPath = loadStaticPath("ffmpeg-static");
export const ffprobePath = loadStaticPath("ffprobe-static");

export async function runBinary(
  command: string,
  args: string[]
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      const result = {
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8")
      };

      if (code === 0) {
        resolve(result);
      } else {
        reject(
          new Error(
            `${command} exited with code ${code}\n${result.stderr || result.stdout}`
          )
        );
      }
    });
  });
}
