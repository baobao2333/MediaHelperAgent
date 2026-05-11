---
name: photo-content-render-package
description: Render Codex-authored photography content packages. Use when Codex needs to create or validate an edit decision list, run FFmpeg-based video drafting, extract cover frames, or assemble post folders from local media assets.
---

# Photo Content Render Package

Use this skill after a content plan exists and the user wants a draft video or package output.

Rendering is deterministic. Codex writes or reviews the EDL; scripts execute FFmpeg.

## Workflow

1. Read:
   - `asset_inventory.json`
   - `content_plan.json`
   - the selected post plan
   - any existing `edit_decision_list.json`
2. Ensure every EDL clip references a known asset id.
3. Ensure video clip time ranges are inside source duration.
4. Prefer simple edits:
   - hard cuts
   - vertical crop for short-form
   - light image-to-video motion
   - cover frame extraction
5. Run the local render command when available.
6. Put generated media under `outputs/{project}/posts/day_##/`.

## Editing Rules

1. First second should have the strongest visual.
2. Avoid filler clips, cheap transitions, and unnecessary slow motion.
3. Portrait content should prioritize face, expression, and pose variation.
4. Travel content should establish place before details.
5. Product content should keep the item clear.
6. Event content should avoid unhandled privacy risks.

## Output

Expected post folder:

```text
outputs/{project}/posts/day_01/
  post_brief.md
  edit_decision_list.json
  caption.md
  cover_candidates/
  output.mp4
```

If rendering cannot run, still produce the EDL and explain the blocker.
