---
name: photo-content-strategy-plan
description: Turn classified photography assets into publishing strategy. Use when Codex needs to select domain profiles, score usable materials, conserve strong shots, generate content_plan.json, publishing_plan.md, or next shooting guidance.
---

# Photo Content Strategy Plan

Use this skill after `classification_results.json` exists and validates.

Codex decides strategy from the visual evidence and structured tags. Scripts only validate JSON.

## Workflow

1. Read `asset_inventory.json` and `classification_results.json`.
2. Determine project-level primary and secondary domains.
3. Combine domain profiles when needed, such as `portrait + cosplay + street_photography`.
4. Identify material pools:
   - hook candidates
   - cover candidates
   - hero assets
   - detail assets
   - b-roll or transition assets
   - risky or discard assets
5. Decide `feasibleDays` from asset quantity, quality, and repetition risk.
6. Write `content_plan.json` and `publishing_plan.md`.
7. Validate JSON with `npm run package:validate`.

## Planning Rules

1. Day 1 must be strong, but should not consume all high-value assets.
2. Do not force the user's target days when materials are too few.
3. Adjacent days need clear visual or theme difference.
4. Use low-consumption formats for later days, such as interaction, recap, guide, comparison, or behind-the-scenes.
5. Keep copy direction grounded in the actual material. Do not write cosplay copy for normal portraits or guide copy for pure mood landscapes.
6. Explicitly say which assets should be saved.

## Output Shape

Use Markdown for human-facing planning:

```text
overall judgment
recommended feasible days
daily plan
material conservation notes
risk notes
next shooting checklist
```

Use JSON for machine-readable continuation:

```text
projectId, platform, targetDays, feasibleDays, posts,
strategySummary, materialConservationNotes, categorySummary
```
