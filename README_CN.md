# Media Helper Agent 中文说明

这是一个 Codex-native 摄影内容 Agent 工具包。它负责把本地照片/视频素材整理成 Codex 容易理解的结构化输入，然后由 Codex 完成分类、策略、排期、打包和审查。

这个项目不是独立 LLM 应用。没有模型 API 层、没有 vision service，也不做自动发布。本地代码只做确定性任务：扫描素材、读取 metadata、抽帧、拼 frame sheet、生成输出模板、校验 JSON schema。

## 发给 Codex 的安装提示

可以把下面这段直接发给 Codex：

```text
请安装并配置这个 Codex-native 摄影内容工具包：

1. Clone https://github.com/baobao2333/mediahelperagent
2. 进入仓库目录。
3. 运行 npm install。
4. 运行 npm run setup:skills，把仓库内置的 photo-content-* skills 安装到全局 Codex skills 目录。
5. 运行 npm run build 和 npm run check。
6. 运行 npm run photo-agent -- --help，确认 CLI 可用。
7. 阅读 AGENTS.md。中文辅助说明见 README_CN.md、AGENTS_CN.md、EXAMPLES_CN.md。
8. 不要添加 LLM API client、vision service、数据库、Web UI 或自动发布能力。
```

## 手动安装

```bash
git clone https://github.com/baobao2333/mediahelperagent
cd mediahelperagent
npm install
npm run setup:skills
npm run build
npm run check
npm run photo-agent -- --help
```

`setup:skills` 会把仓库里的 `skills/photo-content-*` 复制到 Codex 全局 skill 目录：

- 如果设置了 `CODEX_HOME`，使用 `$CODEX_HOME/skills`
- 否则使用 `~/.codex/skills`

Windows 上通常是：

```text
C:\Users\<you>\.codex\skills
```

## 常用命令

```bash
npm run project:init -- --name my_project --platform xiaohongshu --days 5
npm run media:import -- --project my_project --from <folder>
npm run media:analyze -- --project my_project --frame-interval 2
npm run package:scaffold -- --project my_project
npm run package:validate -- --project my_project
```

`classify`、`plan`、`render`、`export` 是 Codex 写内容的阶段，不是本地模型调用。

## 输出结构

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

## 程序阅读文件说明

- `AGENTS.md`：给 Codex 读取的工作区规则。
- `skills/*/SKILL.md`：给 Codex 触发和执行工作流的 skill 文件。
- `skills/*/agents/openai.yaml`：skill 在界面里的元信息。

这些文件保持英文和操作性，方便 agent 稳定触发。中文文档只用于人类阅读和理解。

## 中文文档

- `README_CN.md`：中文安装和使用说明。
- `AGENTS_CN.md`：中文工作区规则解释。
- `EXAMPLES_CN.md`：中文任务示例。

## 协议

MIT。
