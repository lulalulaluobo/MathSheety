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

// 九九乘法表内乘法：因子 1..9，乘积不超过 81
function generateMultiplication() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  return { a, b, op: '×', res: a * b };
}

// 九九乘法表内除法：除数、商均在 1..9，被除数 = 除数 × 商 保证整除无余数
function generateDivision() {
  const b = 1 + Math.floor(Math.random() * 9);
  const q = 1 + Math.floor(Math.random() * 9);
  const a = b * q;
  return { a, b, op: '÷', res: q };
}

// 四种三数运算形式：连加 a+b+c、连减 a-b-c、加减混合 a+b-c、a-b+c
const THREE_OP_PATTERNS = [
  ['+', '+'], // 连加
  ['-', '-'], // 连减
  ['+', '-'], // 加减混合 (a+b-c)
  ['-', '+']  // 加减混合 (a-b+c)
];

// 三数加减运算：最终结果 ≤ range，且按从左到右逐步运算的中间结果均 ≥ 0
// 返回 { a, b, c, ops: ['+'|'-', '+'|'-'], res } 与两数对象区分（含 c 与 ops 字段）
function generateThreeTerm(range, pattern) {
  let limit = 200;
  while (limit > 0) {
    const a = Math.floor(Math.random() * (range + 1));
    const b = Math.floor(Math.random() * (range + 1));
    const c = Math.floor(Math.random() * (range + 1));
    const ops = pattern || THREE_OP_PATTERNS[Math.floor(Math.random() * THREE_OP_PATTERNS.length)];

    // 从左到右逐步运算，校验中间结果与最终结果均合法
    let acc = a;
    let ok = true;
    const vals = [b, c];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === '+') {
        acc = acc + vals[i];
      } else {
        acc = acc - vals[i];
      }
      if (acc < 0) { ok = false; break; } // 中间结果不为负
    }
    if (ok && acc <= range) {
      return { a, b, c, ops, res: acc };
    }
    limit--;
  }
  // 回退逻辑，防止死循环
  return { a: 1, b: 2, c: 3, ops: ['+', '+'], res: 6 };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateDivision,
    generateThreeTerm
  };
}

// 增加 DOM 操作逻辑
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate');
    const btnToggleAnswer = document.getElementById('btn-toggle-answer');
    const btnPrint = document.getElementById('btn-print');
    const btnPdf = document.getElementById('btn-pdf');
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
        } else if (opType === 'mul') {
          formula = generateMultiplication();
        } else if (opType === 'div') {
          formula = generateDivision();
        } else if (opType === 'mix-mul-div') {
          // 乘除混合
          formula = Math.random() < 0.5
            ? generateMultiplication()
            : generateDivision();
        } else if (opType === 'three-term') {
          // 三数加减运算（连加/连减/加减混合四种形式随机）
          formula = generateThreeTerm(range);
        } else {
          // 加减混合
          formula = Math.random() < 0.5
            ? generateAddition(range, allowCarry)
            : generateSubtraction(range, allowBorrow);
        }

        // 三数算式去重键含第三个操作数与两个运算符，两数算式沿用原键
        const key = formula.ops
          ? `${formula.a}${formula.ops[0]}${formula.b}${formula.ops[1]}${formula.c}`
          : `${formula.a}${formula.op}${formula.b}`;
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

            // 三数算式含两个运算符；两数算式沿用单运算符格式
            const expr = q.ops
              ? `${q.a} ${q.ops[0]} ${q.b} ${q.ops[1]} ${q.c}`
              : `${q.a} ${q.op} ${q.b}`;
            rowElement.innerHTML = `
              <span class="formula-expr">${expr}</span>
              <span class="formula-ans">= <span class="ans-val">${q.res}</span></span>
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

    btnPdf.addEventListener('click', () => {
      document.body.classList.add('rendering-pdf');
      const sheetTitle = document.getElementById('sheet-title').textContent.trim();
      const opt = {
        margin:       0,
        filename:     `${sheetTitle}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(sheetContainer).save().then(() => {
        document.body.classList.remove('rendering-pdf');
      }).catch(err => {
        console.error('PDF导出失败:', err);
        document.body.classList.remove('rendering-pdf');
      });
    });

    // 自动初始化
    renderWorksheet();
  });
}
