import { cp, mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "skills");
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const targetDir = path.join(codexHome, "skills");

const entries = await readdir(sourceDir, { withFileTypes: true });
const skills = entries
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("photo-content-"))
  .map((entry) => entry.name);

if (skills.length === 0) {
  throw new Error(`No photo-content skills found in ${sourceDir}`);
}

await mkdir(targetDir, { recursive: true });

for (const skill of skills) {
  const source = path.join(sourceDir, skill);
  const target = path.join(targetDir, skill);
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true });
  console.log(`Installed ${skill} -> ${target}`);
}

console.log(`Installed ${skills.length} skills into ${targetDir}`);
