---
name: photo-content-review-export
description: Review and export Codex-native photography content packages. Use when Codex needs a final quality pass for classification fit, material reuse, repetition, risk tags, cover strength, captions, output completeness, or export readiness.
---

# Photo Content Review Export

Use this skill near the end of a project or after any generated package needs a strict pass.

## Review Checklist

Check:

1. Classification matches visible evidence.
2. Domain profiles are combined correctly.
3. Day 1 is publishable.
4. High-value assets are not consumed too quickly.
5. Consecutive days do not look like reposts.
6. Covers are strong and materially different.
7. Titles and captions match the actual material.
8. Risk tags are handled or explicitly deferred.
9. `feasibleDays` is realistic.
10. No post feels like filler.

## Output

Write or update:

```text
outputs/{project}/review_report.md
```

Use this structure:

```text
Pass / Needs changes
Critical issues
Recommended fixes
Material reuse notes
Risk notes
Export readiness
```

Also run:

```bash
npm run package:validate -- --project <project>
```

## Export Rules

1. Prefer clear Markdown summaries over long internal reasoning.
2. Keep JSON valid and schema-compatible.
3. Do not hide uncertainty. If a visual judgment is weak, mark it.
4. If a package is not ready, list concrete fixes instead of polishing wording.
5. If a file is missing, name the expected path.
