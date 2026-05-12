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

## Dynamic Photo And Stop-Motion Portrait Cuts

Use these rules when turning short portrait videos into extracted-frame edits, dynamic photo albums, or stop-motion gesture sequences:

1. Prioritize beauty-frame quality over action completeness. A still frame should be usable as a standalone screenshot before it is allowed into the sequence.
2. Keep action continuity by using one source clip or one visually consistent scene for the main gesture. Avoid mixing similar clips when it makes the body position, glasses, background, or camera distance jump.
3. Remove elevator, background, outfit, or lighting changes unless they are intentional scene changes.
4. Reject keyframes with face-blocking hands, heavy hand blur, awkward expressions, or unstable composition. Do not rescue a jump with an ugly still.
5. Build gestures as a clear arc: ready pose -> hands rise -> pre-contact pose -> contact or hidden bridge -> recovery -> final beauty hold.
6. Use different timing classes:
   - beauty hold: 0.60-1.15 seconds
   - action beat: 0.16-0.22 seconds
   - motion bridge: 0.12-0.30 seconds
7. Keep action beats fixed and fast. Apply subtle drift only to beauty holds, not every extracted frame.
8. Hide unavoidable jumps with a very short real-motion bridge from the source video instead of inserting blurred or face-blocking stills.
9. Review a selected-keyframe sheet before rendering the final video. The sheet should show chronological continuity and no rejected frame types.
10. Keep filters restrained: light warmth, gentle face brightness, minimal vignette, and no heavy flash transitions unless the music specifically calls for it.

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
