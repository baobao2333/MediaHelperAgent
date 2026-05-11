---
name: photo-content-media-prep
description: Prepare local photography and short-video assets for Codex review. Use when Codex needs to initialize a project, import raw media, scan images/videos, read metadata, extract frames, create timestamped frame sheets, or scaffold content-package templates.
---

# Photo Content Media Prep

Use this skill before any classification or planning. Its job is to turn raw files into artifacts Codex can inspect reliably.

## Workflow

1. Confirm the project exists:

```bash
npm run project:init -- --name <project> --platform xiaohongshu --days 5
```

2. Import raw files:

```bash
npm run media:import -- --project <project> --from <folder>
```

3. Analyze media:

```bash
npm run media:analyze -- --project <project> --frame-interval 2
```

4. Scaffold Codex-fillable outputs:

```bash
npm run package:scaffold -- --project <project>
```

5. Inspect:

- `outputs/{project}/asset_inventory.json`
- `outputs/{project}/frame_sheets/`
- `outputs/{project}/classification_results.template.json`
- `outputs/{project}/content_plan.template.json`

## Media Handling Rules

1. Treat scripts as deterministic helpers, not decision makers.
2. Do not classify content from filenames alone.
3. Use image files directly and video frame sheets for Codex visual review.
4. If FFmpeg fails, report the exact command context and keep any successfully generated inventory.
5. Keep original files in `projects/{project}/raw_assets`; derived files belong under `outputs/{project}`.

## Expected Output

After this stage, Codex should have enough local artifacts to answer:

- What files exist?
- Which are images and which are videos?
- What are the dimensions, durations, and fps?
- Which video frames can be visually reviewed without opening the full video?
- Which JSON templates still need Codex judgment?
