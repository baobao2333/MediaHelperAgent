# Media Helper Agent

Codex-native photography content agent toolkit. It prepares local photo/video assets for Codex, then lets Codex classify, plan, package, and review publishable content.

This is not a standalone LLM app. There is no model API layer, no vision service, and no automatic platform posting. Local code only handles deterministic work: media scanning, metadata, frame extraction, frame sheets, output templates, and schema validation.

## Send This To Codex

Paste this into Codex when setting up from GitHub:

```text
Clone and set up this Codex-native photography content toolkit:

1. Clone https://github.com/baobao2333/mediahelperagent
2. Enter the repo.
3. Run npm install.
4. Run npm run setup:skills to install the bundled photo-content-* skills into the global Codex skills directory.
5. Run npm run build and npm run check.
6. Confirm npm run photo-agent -- --help works.
7. Do not add LLM API clients, vision services, databases, web UI, or auto-posting.
8. Use AGENTS.md for workspace rules, AGENTS_CN.md for the Chinese version, and EXAMPLES_CN.md for Chinese workflow examples.
```

## Manual Setup

```bash
git clone https://github.com/baobao2333/mediahelperagent
cd mediahelperagent
npm install
npm run setup:skills
npm run build
npm run check
npm run photo-agent -- --help
```

`setup:skills` copies the repo's `skills/photo-content-*` folders into the Codex global skills directory:

- `$CODEX_HOME/skills` when `CODEX_HOME` is set
- otherwise `~/.codex/skills`

On this Windows workspace that usually means:

```text
C:\Users\<you>\.codex\skills
```

## Main Commands

```bash
npm run project:init -- --name my_project --platform xiaohongshu --days 5
npm run media:import -- --project my_project --from <folder>
npm run media:analyze -- --project my_project --frame-interval 2
npm run package:scaffold -- --project my_project
npm run package:validate -- --project my_project
```

Codex-authored stages:

```bash
npm run photo-agent -- classify
npm run photo-agent -- plan
npm run photo-agent -- render
npm run photo-agent -- export
```

Those commands are placeholders that remind Codex to use the bundled skills. Classification, planning, captions, and review are written by Codex into Markdown and JSON artifacts.

## Output Shape

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

## Bundled Skills

- `photo-content-orchestrator`
- `photo-content-media-prep`
- `photo-content-classify-tags`
- `photo-content-strategy-plan`
- `photo-content-render-package`
- `photo-content-review-export`

The skill files are executable Codex skill definitions, so they intentionally stay English-first.

## Program-Readable Files

These files are intentionally written for Codex and other coding agents to read:

- `AGENTS.md`: workspace rules loaded by agents when working in this repo.
- `skills/*/SKILL.md`: executable Codex skill instructions and trigger metadata.
- `skills/*/agents/openai.yaml`: UI metadata for installed skills.

Keep these files concise, operational, and English-first so agent triggering remains reliable.

## Chinese Docs

- `README_CN.md`: Chinese setup and usage guide.
- `AGENTS_CN.md`: Chinese human-readable explanation of the workspace rules.
- `EXAMPLES_CN.md`: Chinese examples for giving tasks to Codex.

## License

MIT.
