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
*   **2026-06-14**：新增了“元角分口算练习纸生成器”页面。创建了 `currency.html` 与 `currency.js`，支持单位换算及等值兑换题目，并符合人民币固定面值规范。更新了 `index.html` 与 `style.css` 增加了美观的导航切换页签。针对元角分题目长文本特性进行了排版优化，将网格调整为 2 列并缩窄填空括号宽度，将默认题目数量改为更适合 A4 纸纵向容纳 of 40 题，彻底解决了打印溢出纸张界面的问题。引入了 `html2pdf.js` 库，为页面增加了“导出 PDF”功能。应用户要求，**完全去除了不符合当前生活实际的“分”单位，同时去除了“币值计算”（加减法）题型**，仅保留最核心且实用的单位换算与等值兑换，并通过了全部重构后的测试套件。
*   **2026-06-17**：在主算术页（`app.js` / `index.html`）新增**乘法**与**除法**两种题型。沿用九九乘法表范围（因子、除数、商均在 1..9），除法仅整除无余数（被除数 = 除数 × 商）。在 `app.js` 新增 `generateMultiplication()` 与 `generateDivision()`，返回与加法/减法一致的 `{a,b,op,res}` 对象形状，无需改动渲染器；`renderWorksheet()` 题型分发链追加 `mul`、`div`、`mix-mul-div`（乘除混合）三个分支，现有 `mix`（加减混合）保持不变。`index.html` 题型 radio-group 追加「仅乘法 / 仅除法 / 乘除混合」三项。`tests/generator.test.js` 新增两个 100 次循环的测试，断言因子/商范围、运算正确性与整除约束。全部 7 个单元测试通过。设计要点：九九表范围固定，对乘除题型静默忽略现有「数字范围」与「进位/退位」选项，未引入条件禁用逻辑（最小改动，符合 CLAUDE.md「Simplicity First」）。






## 经验教训与避坑指南
*   (暂无)
