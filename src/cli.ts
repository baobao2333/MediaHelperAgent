#!/usr/bin/env node
import { analyzeMedia, importMedia } from "./media.js";
import { scaffoldPackage } from "./templates.js";
import { platforms, type Platform } from "./taxonomy.js";
import {
  createProject,
  optionalNumber,
  parseArgs,
  requireString
} from "./storage.js";
import { validatePackage } from "./validate.js";

async function main(): Promise<void> {
  const [command = "help", ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  switch (command) {
    case "init":
    case "project:init": {
      const name = requireString(args, "name");
      const platform = parsePlatform(String(args.platform ?? "xiaohongshu"));
      const days = Math.trunc(optionalNumber(args, "days", 5));
      await createProject(name, platform, days);
      console.log(`Initialized project ${name}`);
      break;
    }

    case "import":
    case "media:import": {
      const project = requireString(args, "project");
      const source = requireString(args, "from");
      const count = await importMedia(project, source);
      console.log(`Imported ${count} media files into ${project}`);
      break;
    }

    case "analyze":
    case "media:analyze": {
      const project = requireString(args, "project");
      const frameInterval = optionalNumber(args, "frame-interval", 2);
      const inventory = await analyzeMedia(project, frameInterval);
      console.log(
        `Analyzed ${inventory.assets.length} assets and ${inventory.frameSamples.length} frame samples`
      );
      break;
    }

    case "package:scaffold": {
      const project = requireString(args, "project");
      await scaffoldPackage(project);
      console.log(`Scaffolded package templates for ${project}`);
      break;
    }

    case "package:validate": {
      const project = requireString(args, "project");
      const messages = await validatePackage(project);
      for (const message of messages) {
        console.log(`[${message.level.toUpperCase()}] ${message.message}`);
      }
      if (messages.some((message) => message.level === "error")) {
        process.exitCode = 1;
      }
      break;
    }

    case "classify":
    case "plan":
    case "render":
    case "export": {
      console.log(`${command} is a Codex-authored stage. Use the matching photo-content skill.`);
      break;
    }

    default:
      printHelp();
      if (command !== "help" && command !== "--help" && command !== "-h") {
        process.exitCode = 1;
      }
  }
}

function parsePlatform(value: string): Platform {
  if ((platforms as readonly string[]).includes(value)) {
    return value as Platform;
  }

  throw new Error(`Unsupported platform ${value}`);
}

function printHelp(): void {
  console.log(`photo-agent

Commands:
  project:init      --name <project> [--platform xiaohongshu] [--days 5]
  media:import     --project <project> --from <folder>
  media:analyze    --project <project> [--frame-interval 2]
  package:scaffold --project <project>
  package:validate --project <project>

Codex-authored stages:
  classify, plan, render, export
`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[ERROR] ${message}`);
  process.exit(1);
});
