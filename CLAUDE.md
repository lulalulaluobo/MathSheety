# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from Andrej Karpathy's observations on LLM coding pitfalls.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1 Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2 Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3 Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4 Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5 项目开发硬性约束 (Core Project Rules)

### 5.1 语言偏好 (Language Preferences)
- **中文首选**：每次回复用户必须优先使用中文。
- **辅助文件中文规范**：所有辅助开发的文件（例如 `MEMORY.md`、开发任务计划、阶段性任务总结文件等）必须统一使用中文编写。

### 5.2 版本控制与代码索引 (Git & CodeGraph)
- **Git 仓库**：项目必须使用 git 进行版本控制管理。
- **.gitignore 校验**：严格排除不必要的本地数据及模型运行残留。
- **CodeGraph 实时同步**：代码库索引通过 CodeGraph 服务维护。**每次执行 git commit 提交代码后，必须紧接着进行一次 codegraph 同步**。

### 5.3 搜索工具效率 (Search Optimization)
- **rg 搜索优先**：调用工具进行内容检索时，必须优先使用 `grep_search`（基于 ripgrep/rg）进行高效文本定位，禁止在没有具体范围时使用低效的逐个文件加载阅读循环。

### 5.4 上下文压缩管理 (Context Management)
- **Context Mode 隔离**：提倡分阶段的上下文装载隔离。加载参考文档 and 历史记录时，只提取关键切片，限制单阶段的对话上下文过载。
- **优先使用 ctx_execute**：优先使用 `mcp__context-mode__ctx_execute` 代替直接在 shell 中执行命令以减少上下文占用；遇到大文件数据分析时，必须使用 `mcp__context-mode__ctx_execute_file` 进行处理；长输出内容会自动索引到 FTS5 知识库中以备后续查询。
