---
name: photo-content-classify-tags
description: Classify photography assets from visual evidence. Use when Codex needs to read images or frame sheets and create classification_results.json with domains, multi-layer tags, confidence, risks, and human-review flags.
---

# Photo Content Classify Tags

Use this skill after media prep has produced `asset_inventory.json` and frame sheets.

Codex performs the visual judgment. Do not call a model API or create an LLM service.

## Inputs

Read:

- `outputs/{project}/asset_inventory.json`
- `outputs/{project}/classification_results.template.json`
- Relevant image files or `outputs/{project}/frame_sheets/*.jpg`

## Classification Rules

1. Use multi-label domain scores, not a single forced category.
2. Set `primaryDomain` to the strongest domain, or `mixed_unknown` if uncertain.
3. Do not let a domain hint override visible evidence.
4. Mark `needsHumanReview: true` when confidence is below `0.55` or key visual evidence is unclear.
5. Add risk tags for visible strangers, children, license plates, privacy info, watermarks, heavy blur, overexposure, or brand/logo concerns.
6. Add content-role tags only when visually justified, such as `cover_candidate`, `hook_candidate`, `b_roll`, `detail`, or `discard`.
7. Keep `assetId` values exactly as in the inventory.

## Domains

Use these domains:

```text
portrait, fashion_outfit, cosplay, travel_landscape, street_photography,
food_drink, product_still, event_exhibition, pet_animal, daily_vlog,
interior_architecture, commercial_brand, mixed_unknown
```

## Tag Groups

Fill these groups:

```text
subjectTags, sceneTags, visualTags, actionTags,
contentRoleTags, platformTags, riskTags, styleTags
```

## Output

Write `outputs/{project}/classification_results.json`.

After writing, validate:

```bash
npm run package:validate -- --project <project>
```
