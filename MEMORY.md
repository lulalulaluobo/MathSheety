# 项目记忆 (MEMORY.md)

## 项目背景
*   **项目名称**：MathSheety
*   **项目概述**：这是一个用于进行数学计算、公式求值、生成数学工作表或表格的工具/应用（具体细节将根据 PRD.md 进一步细化）。

## 技术选型
*   **开发语言**：HTML, JavaScript, CSS (根据需要可能引入 React, Tailwind CSS 等框架)
*   **核心库**：(待定)
*   **版本控制**：Git

## 开发进度
*   **2026-06-05**：项目初始化，创建基础开发文档（`CLAUDE.md`、`MEMORY.md`、`PRD.md`），初始化 Git 仓库及 `.gitignore`。启动视觉伴侣（Visual Companion），完成页面排版、网格对齐、无序号设计讨论，并正式编写与提交了 [2026-06-05-mathsheety-design.md](file:///Users/luluen/ai-project/MathSheety/docs/superpowers/specs/2026-06-05-mathsheety-design.md) 设计文档。接着编写并提交了 [2026-06-05-mathsheety-implementation.md](file:///Users/luluen/ai-project/MathSheety/docs/superpowers/plans/2026-06-05-mathsheety-implementation.md) 实施与开发计划。根据开发计划，已实现所有的页面组件、样式表和计算逻辑，并根据反馈去除了答案处的下划线 `__` 改为纯物理占位符，通过了单元测试和浏览器视觉交互测试，生成并更新了 [walkthrough.md](file:///Users/luluen/.gemini/antigravity-ide/brain/2cfd2325-94cf-421b-92a8-2b6208e09d31/walkthrough.md)。项目顺利交付。编写并提交了多架构支持的 [Dockerfile](file:///Users/luluen/ai-project/MathSheety/Dockerfile)。打包了用于离线分发的 [MathSheety.zip](file:///Users/luluen/ai-project/MathSheety/MathSheety.zip) 压缩包。编写并提交了包含 Docker 部署说明 of [README.md](file:///Users/luluen/ai-project/MathSheety/README.md) 文档。
*   **2026-06-14**：新增了“元角分口算练习纸生成器”页面。创建了 `currency.html` 与 `currency.js`，支持单位换算、币值计算及等值兑换题目，并符合人民币固定面值规范。更新了 `index.html` 与 `style.css` 增加了美观的导航切换页签。针对元角分题目长文本特性进行了排版优化，将网格调整为 2 列并缩窄填空括号宽度，将默认题目数量改为更适合 A4 纸纵向容纳的 40 题，彻底解决了打印溢出纸张界面的问题。引入了 `html2pdf.js` 库，为基础口算和元角分换算两个页面增加了“导出 PDF”功能，在生成 PDF 时自动切换至无边框阴影的干净渲染模式。编写了 `tests/currency.test.js` 并通过了所有自动化单元测试。




## 经验教训与避坑指南
*   (暂无)
