# Photography Content Agent Workspace Instructions

## Project Identity

This workspace is a Codex-native photography content agent toolkit.

It is not a standalone LLM application. Do not add an LLM service, vision service, model API wrapper, prompt retry loop, or autonomous model call layer.

Codex is the intelligence layer. Local code only prepares media artifacts, validates structured outputs, and runs deterministic tooling such as FFmpeg and Sharp.

## Core Workflow

Use the global `photo-content-*` skills for content judgment and workflow routing:

- `photo-content-orchestrator`
- `photo-content-media-prep`
- `photo-content-classify-tags`
- `photo-content-strategy-plan`
- `photo-content-render-package`
- `photo-content-review-export`

This repository also keeps a copy of those skills under `skills/` for versioning and reuse.

The intended flow is:

```text
raw photos/videos
  -> local media prep scripts
  -> asset_inventory.json + frame sheets
  -> Codex visual classification
  -> Codex strategy and publishing plan
  -> optional deterministic render/package scripts
  -> Codex review/export pass
```

## Local Commands

Use these npm scripts:

```bash
npm run project:init -- --name my_project --platform xiaohongshu --days 5
npm run media:import -- --project my_project --from <folder>
npm run media:analyze -- --project my_project --frame-interval 2
npm run package:scaffold -- --project my_project
npm run package:validate -- --project my_project
npm run check
npm run build
```

`classify`, `plan`, `render`, and `export` are Codex-authored stages. They may have CLI placeholders, but content decisions should be written by Codex into Markdown and JSON artifacts.

## Output Contract

Project outputs should follow this shape:

```text
projects/{project}/raw_assets/
outputs/{project}/
  asset_inventory.json
  frame_sheets/
  classification_results.template.json
  classification_results.json
  content_plan.template.json
  content_plan.json
  publishing_plan.md
  review_report.md
```

Preserve asset ids exactly as generated in `asset_inventory.json`.

## Implementation Rules

1. Keep deterministic code in TypeScript.
2. Keep schemas in Zod.
3. Keep user-facing content artifacts as Markdown plus JSON.
4. Use `ffmpeg-static` and `ffprobe-static`; do not require system FFmpeg in PATH.
5. Use `sharp` for image metadata and frame sheet composition.
6. Do not infer classification from filenames alone.
7. Do not overbuild app layers, databases, web UI, queues, auth, or server APIs unless explicitly requested.
8. Prefer small cohesive modules over many thin wrappers.
9. Keep code, comments, schema keys, commit messages, and file names in English.
10. Respond to the user in Chinese unless they ask otherwise.

## Validation Rules

Before handing off changes that touch code, run:

```bash
npm run check
```

Run `npm run build` when CLI output or compiled execution matters.

For media workflow changes, run a smoke flow with at least:

1. One image.
2. One short video.
3. `project:init`.
4. `media:import`.
5. `media:analyze`.
6. `package:scaffold`.
7. `package:validate`.

Validation must confirm:

- `asset_inventory.json` is valid.
- Video metadata includes duration, dimensions, and fps when available.
- Frame sheets are generated with timestamps.
- `classification_results.template.json` is created.
- Low confidence classifications require `needsHumanReview: true`.

## Scope Boundaries

Do not implement:

- direct LLM calls
- OpenAI or other model provider clients
- autonomous visual classification services
- auto-posting to platforms
- music matching or copyright matching
- advanced editing effects
- beauty filters, face swaps, or body reshaping
- complex multi-track editing projects

The main product value is helping Codex understand, classify, conserve, plan, package, and review photography materials.
