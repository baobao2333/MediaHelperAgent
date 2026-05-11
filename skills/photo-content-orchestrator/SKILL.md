---
name: photo-content-orchestrator
description: Coordinate a Codex-native photography content agent workflow. Use when the user asks Codex to process photo/video materials into classified assets, publishing plans, render drafts, review reports, or reusable content packages without building a separate LLM-backed app.
---

# Photo Content Orchestrator

Use this skill as the entry point for photography material workflows.

The product shape is Codex-native:

1. Local scripts do deterministic media work.
2. Codex performs visual judgment from images, frame sheets, and JSON inventories.
3. Outputs are Markdown for humans plus JSON for later scripted steps.
4. Do not add a standalone LLM service, model API wrapper, prompt retry loop, or vision backend.

## Stage Routing

Choose the smallest stage that matches the user request:

- Media intake or frame sheets: use `photo-content-media-prep`.
- Classification, tags, domains, and risks: use `photo-content-classify-tags`.
- Strategy, shot scoring, publishing plans, and material conservation: use `photo-content-strategy-plan`.
- EDL, FFmpeg render, covers, and package scaffolding: use `photo-content-render-package`.
- Final quality pass, repetition/risk review, and export readiness: use `photo-content-review-export`.

If the user asks for the whole workflow, run stages in this order:

```text
media prep -> classify/tags -> strategy/plan -> render/package -> review/export
```

## Workspace Contract

Expect this local tool workspace:

```text
projects/{project}/raw_assets/
outputs/{project}/
  asset_inventory.json
  frame_sheets/
  classification_results.template.json
  classification_results.json
  publishing_plan.md
  content_plan.json
  review_report.md
```

Use these npm scripts when available:

```bash
npm run project:init -- --name my_project --platform xiaohongshu --days 5
npm run media:import -- --project my_project --from <folder>
npm run media:analyze -- --project my_project --frame-interval 2
npm run package:scaffold -- --project my_project
npm run package:validate -- --project my_project
```

## Operating Rules

1. Read existing JSON and frame sheets before making content judgments.
2. Prefer conservative material use over forcing target days.
3. Reduce `feasibleDays` when assets are too few or repetitive.
4. Keep domain routing multi-label. Cosplay is one profile, not the product boundary.
5. Mark uncertain visual judgments with `needsHumanReview`.
6. Preserve asset ids exactly as written in `asset_inventory.json`.
7. Keep code, schema keys, file names, and JSON in English.
8. Write user-facing analysis in Chinese unless the user asks otherwise.

## Done Criteria

The workflow is done when the user has:

- A current asset inventory and frame sheets.
- Classification or explicit uncertainty for each usable asset.
- A feasible publishing plan with saved-material notes.
- Optional render outputs if EDL/rendering was requested.
- A review report that calls out repetition, quality, and risk issues.
