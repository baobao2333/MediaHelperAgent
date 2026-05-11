# 摄影内容 Agent 工作区说明

## 项目定位

这个工作区是给 Codex 使用的摄影内容生产工具包。

注意：`AGENTS.md` 和 `skills/*/SKILL.md` 是给 Codex 读取和触发工作流的程序说明文件，保持英文即可。中文说明只放在 `README_CN.md`、`AGENTS_CN.md`、`EXAMPLES_CN.md` 这类面向人看的文档里。

它不是一个独立 LLM 应用。不要添加 LLM service、vision service、模型 API wrapper、prompt retry loop 或自动模型调用层。

Codex 是智能层。本地代码只负责准备媒体素材、校验结构化输出，并运行 FFmpeg、Sharp 这类确定性工具。

## 核心工作流

内容判断和工作流路由使用全局 `photo-content-*` skills：

- `photo-content-orchestrator`
- `photo-content-media-prep`
- `photo-content-classify-tags`
- `photo-content-strategy-plan`
- `photo-content-render-package`
- `photo-content-review-export`

这个仓库也在 `skills/` 下保存了这些 skills 的版本化副本。

目标流程：

```text
原始照片/视频
  -> 本地媒体准备脚本
  -> asset_inventory.json + frame sheets
  -> Codex 视觉分类
  -> Codex 内容策略和发布计划
  -> 可选的确定性渲染/打包脚本
  -> Codex 审查/导出
```

## 本地命令

```bash
npm run setup:skills
npm run project:init -- --name my_project --platform xiaohongshu --days 5
npm run media:import -- --project my_project --from <folder>
npm run media:analyze -- --project my_project --frame-interval 2
npm run package:scaffold -- --project my_project
npm run package:validate -- --project my_project
npm run check
npm run build
```

`classify`、`plan`、`render`、`export` 是 Codex 编写内容的阶段。CLI 可以保留占位提示，但分类、排期、文案、审查这些决策应由 Codex 写入 Markdown 和 JSON。

## 输出约定

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

必须保留 `asset_inventory.json` 里生成的 asset id，不要改名。

## 实现规则

1. 确定性代码使用 TypeScript。
2. schema 使用 Zod。
3. 面向用户的内容产物使用 Markdown + JSON。
4. 使用 `ffmpeg-static` 和 `ffprobe-static`，不要要求系统 PATH 里有 FFmpeg。
5. 使用 `sharp` 读取图片信息、拼接 frame sheet。
6. 不要只靠文件名做分类判断。
7. 不要过度添加 app layer、数据库、Web UI、队列、鉴权或服务端 API。
8. 优先少量内聚模块，不要拆很多薄 wrapper。
9. 代码、注释、schema key、commit message、文件名用英文。
10. 默认用中文回复用户。

## 验证规则

改动代码后至少运行：

```bash
npm run check
```

涉及 CLI 输出或编译执行时运行：

```bash
npm run build
```

涉及媒体流程时，至少用一张图片和一个短视频跑 smoke：

1. `project:init`
2. `media:import`
3. `media:analyze`
4. `package:scaffold`
5. `package:validate`

需要确认：

- `asset_inventory.json` 合法。
- 视频 metadata 包含 duration、dimensions、fps。
- frame sheet 成功生成，并带时间戳。
- `classification_results.template.json` 成功生成。
- 低置信分类必须要求 `needsHumanReview: true`。

## 范围边界

不要实现：

- 直接 LLM 调用
- OpenAI 或其他模型 provider client
- 自动视觉分类服务
- 自动发布到平台
- 音乐匹配或版权匹配
- 高级剪辑特效
- 美颜、换脸、身材重塑
- 复杂多轨剪辑工程

这个项目的主要价值是帮助 Codex 理解、分类、节约、计划、打包和审查摄影素材。
