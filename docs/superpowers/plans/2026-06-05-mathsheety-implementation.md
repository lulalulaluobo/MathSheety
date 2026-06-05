# MathSheety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端的一年级口算练习纸生成网页工具，支持自定义参数（加减题型、10/20/100范围、进退位控制、20/50/100题数）、答案显隐，并高度优化 A4 纸张排版用于直接打印。

**Architecture:** 采用分层结构，包含 `index.html`（结构）、`style.css`（护眼风格及 A4 打印样式）和 `app.js`（题目生成与界面交互）。核心题目生成器设计为纯函数，以支持 Node.js 环境下的自动化测试与验证。

**Tech Stack:** Vanilla HTML, CSS, JavaScript (支持本地双击直接运行)

---

### Task 1: 项目基本结构与测试套件搭建

**Files:**
*   Create: [package.json](file:///Users/luluen/ai-project/MathSheety/package.json)
*   Create: [tests/generator.test.js](file:///Users/luluen/ai-project/MathSheety/tests/generator.test.js)
*   Create: [app.js](file:///Users/luluen/ai-project/MathSheety/app.js)

- [ ] **Step 1: 创建仅用于本地开发测试的极简 package.json**
    创建 `package.json` 以声明测试运行命令。
    ```json
    {
      "name": "mathsheety",
      "version": "1.0.0",
      "scripts": {
        "test": "node --test tests/*.test.js"
      }
    }
    ```

- [ ] **Step 2: 在 app.js 中声明核心算法的函数占位符（支持 Node.js 导出）**
    创建 `app.js`，包含核心函数存根，并在文件底部处理 CommonJS 模块导出以便测试环境导入。
    ```javascript
    function generateAddition(range, allowCarry) {
      return { a: 0, b: 0, op: '+', res: 0 };
    }

    function generateSubtraction(range, allowBorrow) {
      return { a: 0, b: 0, op: '-', res: 0 };
    }

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        generateAddition,
        generateSubtraction
      };
    }
    ```

- [ ] **Step 3: 编写核心算式生成规则的单元测试**
    创建 `tests/generator.test.js`，使用 Node.js 原生测试框架 `node:test` 验证进退位判定和数值范围。
    ```javascript
    const test = require('node:test');
    const assert = require('node:assert');
    const { generateAddition, generateSubtraction } = require('../app.js');

    test('generateAddition - no carry within 20', () => {
      // 循环生成100次，验证是否满足加法不进位规则
      for (let i = 0; i < 100; i++) {
        const { a, b, res } = generateAddition(20, false);
        assert.ok(res <= 20, `Result ${res} exceeds 20`);
        assert.ok((a % 10) + (b % 10) < 10, `Addition a=${a}, b=${b} should not carry`);
        assert.equal(a + b, res);
      }
    });

    test('generateSubtraction - no borrow within 20', () => {
      // 循环生成100次，验证是否满足减法不退位规则
      for (let i = 0; i < 100; i++) {
        const { a, b, res } = generateSubtraction(20, false);
        assert.ok(a <= 20, `Minuend ${a} exceeds 20`);
        assert.ok(a >= b, `Minuend ${a} must be >= Subtrahend ${b}`);
        assert.ok((a % 10) >= (b % 10), `Subtraction a=${a}, b=${b} should not borrow`);
        assert.equal(a - b, res);
      }
    });
    ```

- [ ] **Step 4: 运行测试并验证其失败**
    在项目根目录运行以下命令，确认测试因为未实现而失败：
    Run: `npm test`
    Expected: 测试失败，AssertionError。

- [ ] **Step 5: 提交本步初始化**
    ```bash
    git add package.json app.js tests/generator.test.js
    git commit -m "test: add test harness and failing tests for math generator"
    ```

---

### Task 2: 算式生成引擎开发

**Files:**
*   Modify: [app.js](file:///Users/luluen/ai-project/MathSheety/app.js)

- [ ] **Step 1: 实现加法生成逻辑（包含进位控制）**
    在 `app.js` 中编写完整的 `generateAddition` 函数。
    ```javascript
    function generateAddition(range, allowCarry) {
      let limit = 200;
      while (limit > 0) {
        const a = Math.floor(Math.random() * (range + 1));
        const b = Math.floor(Math.random() * (range - a + 1));
        const res = a + b;
        
        if (!allowCarry) {
          if ((a % 10) + (b % 10) >= 10) {
            limit--;
            continue;
          }
        }
        return { a, b, op: '+', res };
      }
      // 回退逻辑，防止死循环
      return { a: 1, b: 2, op: '+', res: 3 };
    }
    ```

- [ ] **Step 2: 实现减法生成逻辑（包含退位控制）**
    在 `app.js` 中编写完整的 `generateSubtraction` 函数。
    ```javascript
    function generateSubtraction(range, allowBorrow) {
      let limit = 200;
      while (limit > 0) {
        const a = Math.floor(Math.random() * (range + 1));
        const b = Math.floor(Math.random() * (a + 1));
        const res = a - b;
        
        if (!allowBorrow) {
          if ((a % 10) < (b % 10)) {
            limit--;
            continue;
          }
        }
        return { a, b, op: '-', res };
      }
      return { a: 5, b: 2, op: '-', res: 3 };
    }
    ```

- [ ] **Step 3: 运行测试验证算法通过**
    Run: `npm test`
    Expected: 测试全部通过。

- [ ] **Step 4: 提交生成引擎代码**
    ```bash
    git add app.js
    git commit -m "feat: implement addition and subtraction logic with carry/borrow rules"
    ```

---

### Task 3: 页面骨架搭建与配置面板编写

**Files:**
*   Create: [index.html](file:///Users/luluen/ai-project/MathSheety/index.html)

- [ ] **Step 1: 创建 HTML 主页结构，增加配置面板与练习纸容器**
    在 `index.html` 中编写完整的页面结构骨架，遵循顶部配置面板、底部预览练习纸的布局。
    ```html
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MathSheety - 口算练习纸生成器</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header class="config-panel">
        <div class="header-title">
          <h1>MathSheety</h1>
          <p>口算练习纸生成工具</p>
        </div>
        <div class="config-options">
          <div class="config-group">
            <span class="config-label">题型</span>
            <div class="radio-group">
              <label><input type="radio" name="op-type" value="mix" checked> 加减混合</label>
              <label><input type="radio" name="op-type" value="add"> 仅加法</label>
              <label><input type="radio" name="op-type" value="sub"> 仅减法</label>
            </div>
          </div>
          <div class="config-group">
            <span class="config-label">数字范围</span>
            <div class="radio-group">
              <label><input type="radio" name="range" value="10"> 10以内</label>
              <label><input type="radio" name="range" value="20" checked> 20以内</label>
              <label><input type="radio" name="range" value="100"> 100以内</label>
            </div>
          </div>
          <div class="config-group">
            <span class="config-label">规则设置</span>
            <div class="checkbox-group">
              <label><input type="checkbox" id="allow-carry" checked> 允许加法进位</label>
              <label><input type="checkbox" id="allow-borrow" checked> 允许减法退位</label>
            </div>
          </div>
          <div class="config-group">
            <span class="config-label">题目数量</span>
            <select id="questions-count">
              <option value="20">20 题</option>
              <option value="50" selected>50 题</option>
              <option value="100">100 题</option>
            </select>
          </div>
        </div>
        <div class="actions-bar">
          <button id="btn-generate" class="btn btn-primary">生成练习纸</button>
          <button id="btn-toggle-answer" class="btn btn-secondary">显示答案</button>
          <button id="btn-print" class="btn btn-accent">打印练习纸</button>
        </div>
      </header>

      <main class="preview-area">
        <div class="sheet-container" id="sheet-container">
          <div class="sheet-header">
            <h2 id="sheet-title">口算练习纸</h2>
            <div class="student-info">
              <span>姓名：___________</span>
              <span>日期：2026年__月__日</span>
              <span>用时：__分__秒</span>
              <span>成绩：_____/_____</span>
            </div>
          </div>
          <div class="sheet-grid" id="sheet-grid">
            <!-- 题目由 JavaScript 动态生成并填充 -->
          </div>
          <div class="sheet-footer">
            <span>MathSheety 智能生成</span>
            <span>A4 规格标准排版 (210mm × 297mm)</span>
          </div>
        </div>
      </main>
      <script src="app.js"></script>
    </body>
    </html>
    ```

- [ ] **Step 2: 提交网页基本骨架**
    ```bash
    git add index.html
    git commit -m "feat: add main HTML structure for MathSheety UI"
    ```

---

### Task 4: UI 精美样式与 A4 打印排版开发

**Files:**
*   Create: [style.css](file:///Users/luluen/ai-project/MathSheety/style.css)

- [ ] **Step 1: 编写 style.css，实现莫兰迪色系与标准 A4 模拟卡片**
    在 `style.css` 中编写完整样式，定义 CSS 变量、毛玻璃效果、网格分割线以及等号左右撑开布局。
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');

    :root {
      --bg-primary: #FAF6F0; /* 护眼象牙白 */
      --bg-panel: #FFFFFF;
      --border-light: #E6DFD5;
      --text-dark: #4A433D;
      --text-muted: #8F857B;
      --accent-coral: #C88C6B; /* 珊瑚橙 */
      --accent-green: #8EA68B; /* 森绿 */
      --accent-blue: #6B9EC8;  /* 科技蓝 */
      
      --font-ui: 'Outfit', 'Inter', system-ui, sans-serif;
      --font-mono: 'Courier New', Courier, monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-primary);
      color: var(--text-dark);
      font-family: var(--font-ui);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding-bottom: 2rem;
    }

    /* 配置面板样式 */
    .config-panel {
      width: 100%;
      max-width: 900px;
      background: var(--bg-panel);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      box-shadow: 0 4px 20px rgba(74, 67, 61, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .header-title h1 {
      font-size: 1.5rem;
      color: var(--accent-coral);
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .header-title p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .config-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      border-top: 1px solid var(--border-light);
      padding-top: 1rem;
    }

    .config-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .config-label {
      font-size: 0.85rem;
      font-weight: bold;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .radio-group, .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.9rem;
    }
    .radio-group label, .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
    }

    select {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 0.4rem;
      color: var(--text-dark);
      font-family: var(--font-ui);
      font-size: 0.9rem;
      outline: none;
    }

    /* 动作按钮区 */
    .actions-bar {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      border-top: 1px solid var(--border-light);
      padding-top: 1rem;
    }

    .btn {
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-family: var(--font-ui);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-primary { background: var(--accent-coral); color: white; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-secondary { background: var(--accent-green); color: white; }
    .btn-secondary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-accent { background: var(--accent-blue); color: white; }
    .btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }

    /* A4 练习纸容器 */
    .preview-area {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .sheet-container {
      width: 794px; /* 标准 A4 像素宽度 */
      height: 1123px; /* 标准 A4 像素高度 */
      background: #FFFFFF;
      border: 1px solid #D1C9BE;
      border-radius: 4px;
      box-shadow: 0 12px 36px rgba(74, 67, 61, 0.08);
      padding: 4.5rem 3.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      position: relative;
    }

    .sheet-header {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      border-bottom: 2px double var(--border-light);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .sheet-header h2 {
      font-size: 2rem;
      letter-spacing: 0.3em;
      color: #332E2A;
      font-weight: 700;
    }
    .student-info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: #5C544E;
      font-weight: 500;
    }
    .student-info span {
      white-space: nowrap;
    }

    /* 算式网格布局 */
    .sheet-grid {
      display: grid;
      grid-template-columns: 1fr 1px 1fr 1px 1fr 1px 1fr;
      gap: 0 1.5rem;
      flex-grow: 1;
      margin-bottom: 2rem;
      align-content: space-between;
    }

    /* 每一列内部容器 */
    .grid-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      min-height: 750px;
    }

    /* 列分隔线 */
    .grid-divider {
      border-left: 1px dashed var(--border-light);
      height: 100%;
    }

    /* 每一个算式算子对齐样式 */
    .formula-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      white-space: nowrap;
      font-family: var(--font-mono);
      font-size: 1.15rem;
      font-weight: 700;
      color: #2C2724;
      line-height: 1.8;
    }

    .formula-expr {
      white-space: nowrap;
    }

    .formula-ans {
      white-space: nowrap;
    }
    
    /* 答案显隐控制：默认隐藏答案，当带 .show-answers 类时显示答案结果 */
    .sheet-container:not(.show-answers) .ans-val {
      visibility: hidden;
    }
    .sheet-container.show-answers .ans-val {
      visibility: visible;
      color: var(--accent-coral); /* 答案显示为淡橙色区分 */
    }

    .sheet-footer {
      text-align: center;
      font-size: 0.8rem;
      color: #AEA59A;
      border-top: 1px dashed var(--border-light);
      padding-top: 1rem;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
    }

    /* ===== A4 打印优化媒体查询 ===== */
    @media print {
      body {
        background: #FFFFFF !important;
        padding: 0;
        margin: 0;
      }
      .config-panel {
        display: none !important;
      }
      .sheet-container {
        width: 100% !important;
        height: 100vh !important;
        border: none !important;
        box-shadow: none !important;
        padding: 2.5rem 2rem !important; /* 打印边距适当紧凑 */
        margin: 0 !important;
      }
    }
    ```

- [ ] **Step 2: 提交排版 CSS 文件**
    ```bash
    git add style.css
    git commit -m "feat: add warm pastel UI design and strict A4 print media styles"
    ```

---

### Task 5: DOM 渲染与完整逻辑集成

**Files:**
*   Modify: [app.js](file:///Users/luluen/ai-project/MathSheety/app.js)

- [ ] **Step 1: 编写 app.js 交互逻辑**
    完善 `app.js` 以关联 DOM 节点、获取配置值、去重并填充 4 列题目，实现显示答案切换和调用浏览器打印。
    ```javascript
    // 增加 DOM 操作逻辑
    if (typeof window !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        const btnGenerate = document.getElementById('btn-generate');
        const btnToggleAnswer = document.getElementById('btn-toggle-answer');
        const btnPrint = document.getElementById('btn-print');
        const sheetContainer = document.getElementById('sheet-container');
        const sheetGrid = document.getElementById('sheet-grid');

        let showAnswers = false;

        // 生成器主入口
        function renderWorksheet() {
          const opType = document.querySelector('input[name="op-type"]:checked').value;
          const range = parseInt(document.querySelector('input[name="range"]:checked').value, 10);
          const allowCarry = document.getElementById('allow-carry').checked;
          const allowBorrow = document.getElementById('allow-borrow').checked;
          const count = parseInt(document.getElementById('questions-count').value, 10);

          const questions = [];
          const questionSet = new Set();
          let failCount = 0;

          while (questions.length < count && failCount < 250) {
            let formula;
            // 题型分发
            if (opType === 'add') {
              formula = generateAddition(range, allowCarry);
            } else if (opType === 'sub') {
              formula = generateSubtraction(range, allowBorrow);
            } else {
              // 混合
              formula = Math.random() < 0.5 
                ? generateAddition(range, allowCarry)
                : generateSubtraction(range, allowBorrow);
            }

            const key = `${formula.a}${formula.op}${formula.b}`;
            if (!questionSet.has(key)) {
              questionSet.add(key);
              questions.push(formula);
              failCount = 0; // 重置避堵计数器
            } else {
              failCount++;
            }
          }

          // 将题目划分为 4 列
          sheetGrid.innerHTML = '';
          const colCount = 4;
          const itemsPerCol = Math.ceil(questions.length / colCount);

          for (let col = 0; col < colCount; col++) {
            // 插入一列
            const colElement = document.createElement('div');
            colElement.className = 'grid-col';

            for (let row = 0; row < itemsPerCol; row++) {
              const idx = col * itemsPerCol + row;
              if (idx < questions.length) {
                const q = questions[idx];
                const rowElement = document.createElement('div');
                rowElement.className = 'formula-row';
                
                // 对齐空格：在算式右侧保留等宽间隙
                const expr = `${q.a} ${q.op} ${q.b}`;
                rowElement.innerHTML = `
                  <span class="formula-expr">${expr}</span>
                  <span class="formula-ans">= <span class="ans-val">${q.res}</span>__</span>
                `;
                colElement.appendChild(rowElement);
              }
            }
            sheetGrid.appendChild(colElement);

            // 插入竖分割线
            if (col < colCount - 1) {
              const divider = document.createElement('div');
              divider.className = 'grid-divider';
              sheetGrid.appendChild(divider);
            }
          }
        }

        // 按钮监听器
        btnGenerate.addEventListener('click', () => {
          renderWorksheet();
        });

        btnToggleAnswer.addEventListener('click', () => {
          showAnswers = !showAnswers;
          if (showAnswers) {
            sheetContainer.classList.add('show-answers');
            btnToggleAnswer.textContent = '隐藏答案';
          } else {
            sheetContainer.classList.remove('show-answers');
            btnToggleAnswer.textContent = '显示答案';
          }
        });

        btnPrint.addEventListener('click', () => {
          window.print();
        });

        // 自动初始化
        renderWorksheet();
      });
    }
    ```

- [ ] **Step 2: 再次运行测试，确保没破坏单元测试**
    Run: `npm test`
    Expected: 测试完全通过。

- [ ] **Step 3: 提交完整实现代码**
    ```bash
    git add app.js
    git commit -m "feat: complete UI integration, DOM rendering, and printing controls"
    ```
