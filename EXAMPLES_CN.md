# 中文示例

## 示例 1：让 Codex 自动安装配置

把这段发给 Codex：

```text
请帮我安装并配置这个项目：
https://github.com/baobao2333/mediahelperagent

要求：
1. clone 仓库。
2. npm install。
3. npm run setup:skills，把仓库里的 photo-content-* skills 安装到全局 Codex skills。
4. npm run build。
5. npm run check。
6. npm run photo-agent -- --help，确认 CLI 可用。
7. 阅读 AGENTS.md 和 AGENTS_CN.md。
8. 不要添加任何 LLM API、vision service、Web UI、数据库或自动发布功能。
```

说明：

- `AGENTS.md` 是给 Codex 读取的工作区规则。
- `skills/*/SKILL.md` 是给 Codex 触发和执行工作流的 skill 文件。
- 中文文档用于人类理解，不复制每个 skill 的中文版本。

## 示例 2：初始化一个素材项目

```bash
npm run project:init -- --name cosplay_weekend --platform xiaohongshu --days 5
npm run media:import -- --project cosplay_weekend --from "E:\素材\cosplay_weekend"
npm run media:analyze -- --project cosplay_weekend --frame-interval 2
npm run package:scaffold -- --project cosplay_weekend
npm run package:validate -- --project cosplay_weekend
```

生成后重点看：

```text
outputs/cosplay_weekend/asset_inventory.json
outputs/cosplay_weekend/frame_sheets/
outputs/cosplay_weekend/classification_results.template.json
outputs/cosplay_weekend/publishing_plan.md
```

## 示例 3：让 Codex 分类打标

把这段发给 Codex：

```text
使用 photo-content-classify-tags skill。

项目：cosplay_weekend

请读取：
- outputs/cosplay_weekend/asset_inventory.json
- outputs/cosplay_weekend/frame_sheets/
- outputs/cosplay_weekend/classification_results.template.json

根据图片和 frame sheet，生成：
- outputs/cosplay_weekend/classification_results.json

要求：
1. 多标签分类，不要强行单选。
2. cosplay 只是 profile，不是整个产品边界。
3. confidence < 0.55 时 needsHumanReview 必须为 true。
4. 标记路人、车牌、水印、过曝、模糊等风险。
5. 完成后运行 npm run package:validate -- --project cosplay_weekend。
```

## 示例 4：让 Codex 生成发布计划

```text
使用 photo-content-strategy-plan skill。

项目：cosplay_weekend
目标平台：小红书
目标天数：5 天

请读取：
- outputs/cosplay_weekend/asset_inventory.json
- outputs/cosplay_weekend/classification_results.json

请生成：
- outputs/cosplay_weekend/content_plan.json
- outputs/cosplay_weekend/publishing_plan.md

要求：
1. 如果素材不足，不要硬凑 5 天。
2. Day 1 要强，但不能用完全部高价值素材。
3. 明确哪些素材留到后面。
4. 连续两天不要像重复发布。
5. 最后运行 npm run package:validate -- --project cosplay_weekend。
```

## 示例 5：审查内容包

```text
使用 photo-content-review-export skill。

项目：cosplay_weekend

请审查：
- 分类是否符合画面证据
- domain profile 是否选对
- Day 1 是否够强
- 是否素材消耗过快
- 连续发布是否重复
- 风险标签是否处理
- content_plan.json 是否能通过校验

请写入：
- outputs/cosplay_weekend/review_report.md
```
