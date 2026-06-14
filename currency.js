// 元角分固定面额定义
const YUAN_DENOMINATIONS = [1, 2, 5, 10, 50, 100];
const JIAO_DENOMINATIONS = [1, 5];
const FEN_DENOMINATIONS = [1];

// 随机从数组中选择一个元素
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 随机生成一个指定范围内的整数 [min, max]
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 1. 单位换算题目生成
 * 规则：
 * - includeJiao: 是否包含角
 * - includeFen: 是否包含分
 * - maxYuan: 最大元面值（10, 50, 100）
 */
function generateConversion(maxYuan, includeJiao, includeFen) {
  // 过滤出可用的元面额
  const validYuans = YUAN_DENOMINATIONS.filter(v => v <= maxYuan);
  
  // 模板库定义
  const templates = [];

  // T1: X元 = ( )角 (需要包含角)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomChoice(validYuans);
      return {
        expr: `${yuan}元 = `,
        ansHtml: `( <span class="ans-val">${yuan * 10}</span> )角`,
        key: `conv_y2j_${yuan}`
      };
    });
  }

  // T2: X角 = ( )分 (需要包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 2, 5, 6, 8]); // 常见角值
      return {
        expr: `${jiao}角 = `,
        ansHtml: `( <span class="ans-val">${jiao * 10}</span> )分`,
        key: `conv_j2f_${jiao}`
      };
    });
  }

  // T3: X元 = ( )分 (需要包含分)
  if (includeFen) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 10)); // 避免分值过大，限制在10元以内
      return {
        expr: `${yuan}元 = `,
        ansHtml: `( <span class="ans-val">${yuan * 100}</span> )分`,
        key: `conv_y2f_${yuan}`
      };
    });
  }

  // T4: X角 = ( )元 (需要包含角)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 10));
      const jiao = yuan * 10;
      return {
        expr: `${jiao}角 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元`,
        key: `conv_j2y_${jiao}`
      };
    });
  }

  // T5: X分 = ( )角 (需要包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 2, 5, 10]);
      const fen = jiao * 10;
      return {
        expr: `${fen}分 = `,
        ansHtml: `( <span class="ans-val">${jiao}</span> )角`,
        key: `conv_f2j_${fen}`
      };
    });
  }

  // T6: X分 = ( )元 (需要包含分)
  if (includeFen) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 10));
      const fen = yuan * 100;
      return {
        expr: `${fen}分 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元`,
        key: `conv_f2y_${fen}`
      };
    });
  }

  // T7: X元Y角 = ( )角 (需要包含角)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomRange(1, Math.min(10, maxYuan));
      const jiao = randomChoice([1, 2, 5, 8]);
      return {
        expr: `${yuan}元${jiao}角 = `,
        ansHtml: `( <span class="ans-val">${yuan * 10 + jiao}</span> )角`,
        key: `conv_yj2j_${yuan}_${jiao}`
      };
    });
  }

  // T8: X元Y角 = ( )分 (需要包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const yuan = randomRange(1, Math.min(2, maxYuan)); // 限制在2元以内，防数据过大
      const jiao = randomChoice([1, 2, 5]);
      return {
        expr: `${yuan}元${jiao}角 = `,
        ansHtml: `( <span class="ans-val">${yuan * 100 + jiao * 10}</span> )分`,
        key: `conv_yj2f_${yuan}_${jiao}`
      };
    });
  }

  // T9: X角Y分 = ( )分 (需要包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 2, 5]);
      const fen = 1; // 分仅定义为 1分
      return {
        expr: `${jiao}角${fen}分 = `,
        ansHtml: `( <span class="ans-val">${jiao * 10 + fen}</span> )分`,
        key: `conv_jf2f_${jiao}_${fen}`
      };
    });
  }

  // T10: X角 = ( )元( )角 (需要包含角)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomRange(1, Math.min(5, maxYuan));
      const jiao = randomChoice([1, 2, 5]);
      const totalJiao = yuan * 10 + jiao;
      return {
        expr: `${totalJiao}角 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元( <span class="ans-val">${jiao}</span> )角`,
        key: `conv_j2yj_${totalJiao}`
      };
    });
  }

  // T11: X分 = ( )元( )角 (需要包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const yuan = randomRange(1, Math.min(2, maxYuan));
      const jiao = randomChoice([1, 5]);
      const totalFen = yuan * 100 + jiao * 10;
      return {
        expr: `${totalFen}分 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元( <span class="ans-val">${jiao}</span> )角`,
        key: `conv_f2yj_${totalFen}`
      };
    });
  }

  // 安全回退：如果没有任何可用模板，返回最基本的
  if (templates.length === 0) {
    return {
      expr: "10角 = ",
      ansHtml: `( <span class="ans-val">1</span> )元`,
      key: "fallback_10j_1y"
    };
  }

  // 随机调用一个模板生成题目
  const t = randomChoice(templates);
  return t();
}

/**
 * 2. 币值加减法计算生成
 */
function generateArithmetic(maxYuan, includeJiao, includeFen) {
  const validYuans = YUAN_DENOMINATIONS.filter(v => v <= maxYuan);
  const templates = [];

  // A1: X元 + Y元 = ( )元
  templates.push(() => {
    // 确保加数和被加数和在合理范围内，且使用面额或常见组合
    const a = randomChoice(validYuans.filter(v => v < maxYuan));
    const b = randomChoice(validYuans.filter(v => v <= maxYuan - a));
    return {
      expr: `${a}元 + ${b}元 = `,
      ansHtml: `( <span class="ans-val">${a + b}</span> )元`,
      key: `arith_y_add_${a}_${b}`
    };
  });

  // A2: X元 - Y元 = ( )元
  templates.push(() => {
    const a = randomChoice(validYuans.filter(v => v > 1));
    const b = randomChoice(validYuans.filter(v => v < a));
    return {
      expr: `${a}元 - ${b}元 = `,
      ansHtml: `( <span class="ans-val">${a - b}</span> )元`,
      key: `arith_y_sub_${a}_${b}`
    };
  });

  // A3: X角 + Y角 = ( )角 (包含角)
  if (includeJiao) {
    templates.push(() => {
      const a = randomChoice([1, 2, 5]);
      const b = randomChoice([1, 2, 5]);
      return {
        expr: `${a}角 + ${b}角 = `,
        ansHtml: `( <span class="ans-val">${a + b}</span> )角`,
        key: `arith_j_add_${a}_${b}`
      };
    });
  }

  // A4: X角 - Y角 = ( )角 (包含角)
  if (includeJiao) {
    templates.push(() => {
      const a = randomChoice([2, 5, 6]);
      const b = randomChoice([1, 2, 5].filter(v => v < a));
      return {
        expr: `${a}角 - ${b}角 = `,
        ansHtml: `( <span class="ans-val">${a - b}</span> )角`,
        key: `arith_j_sub_${a}_${b}`
      };
    });
  }

  // A5: X元 + Y角 = ( )元( )角 (包含角)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 20));
      const jiao = randomChoice([1, 2, 5]);
      return {
        expr: `${yuan}元 + ${jiao}角 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元( <span class="ans-val">${jiao}</span> )角`,
        key: `arith_yj_mix_add_${yuan}_${jiao}`
      };
    });
  }

  // A6: X元Y角 - Z角 = ( )元( )角 (包含角，无退位)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 10));
      const jiao = randomChoice([5, 6, 8]);
      const z = randomChoice([1, 2, 5].filter(v => v < jiao));
      return {
        expr: `${yuan}元${jiao}角 - ${z}角 = `,
        ansHtml: `( <span class="ans-val">${yuan}</span> )元( <span class="ans-val">${jiao - z}</span> )角`,
        key: `arith_yj_mix_sub_no_borrow_${yuan}_${jiao}_${z}`
      };
    });
  }

  // A7: X元 - Y角 = ( )角 或 ( )元( )角 (包含角，带退位)
  if (includeJiao) {
    templates.push(() => {
      const yuan = randomChoice(validYuans.filter(v => v <= 10));
      const jiao = randomChoice([1, 2, 5]);
      if (yuan === 1) {
        // 1元 - X角 = ( )角
        return {
          expr: `1元 - ${jiao}角 = `,
          ansHtml: `( <span class="ans-val">${10 - jiao}</span> )角`,
          key: `arith_yj_mix_sub_borrow_1_${jiao}`
        };
      } else {
        // X元 - Y角 = (X-1)元(10-Y)角
        return {
          expr: `${yuan}元 - ${jiao}角 = `,
          ansHtml: `( <span class="ans-val">${yuan - 1}</span> )元( <span class="ans-val">${10 - jiao}</span> )角`,
          key: `arith_yj_mix_sub_borrow_x_${yuan}_${jiao}`
        };
      }
    });
  }

  // A8: 1分 + 1分 = ( )分 (包含分)
  if (includeFen) {
    templates.push(() => {
      return {
        expr: `1分 + 1分 = `,
        ansHtml: `( <span class="ans-val">2</span> )分`,
        key: "arith_f_add_1_1"
      };
    });
  }

  // A9: X角 + 1分 = ( )角( )分 (包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 2, 5]);
      return {
        expr: `${jiao}角 + 1分 = `,
        ansHtml: `( <span class="ans-val">${jiao}</span> )角( <span class="ans-val">1</span> )分`,
        key: `arith_jf_add_${jiao}_1`
      };
    });
  }

  // A10: X角 - 1分 = ( )分 或 ( )角( )分 (包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 5]);
      if (jiao === 1) {
        return {
          expr: `1角 - 1分 = `,
          ansHtml: `( <span class="ans-val">9</span> )分`,
          key: "arith_jf_sub_borrow_1"
        };
      } else {
        return {
          expr: `5角 - 1分 = `,
          ansHtml: `( <span class="ans-val">4</span> )角( <span class="ans-val">9</span> )分`,
          key: "arith_jf_sub_borrow_5"
        };
      }
    });
  }

  const t = randomChoice(templates);
  return t();
}

/**
 * 3. 面额等值兑换题目生成
 */
function generateExchange(maxYuan, includeJiao, includeFen) {
  const templates = [];

  // E1: 1张X元可以换( )张Y元
  // 元固定面值：1, 2, 5, 10, 50, 100
  const yuanExchanges = [
    { a: 100, b: 50, ans: 2 },
    { a: 100, b: 10, ans: 10 },
    { a: 100, b: 5, ans: 20 },
    { a: 100, b: 2, ans: 50 },
    { a: 100, b: 1, ans: 100 },
    { a: 50, b: 10, ans: 5 },
    { a: 50, b: 5, ans: 10 },
    { a: 50, b: 2, ans: 25 },
    { a: 50, b: 1, ans: 50 },
    { a: 10, b: 5, ans: 2 },
    { a: 10, b: 2, ans: 5 },
    { a: 10, b: 1, ans: 10 },
    { a: 5, b: 1, ans: 5 },
    { a: 2, b: 1, ans: 2 }
  ].filter(ex => ex.a <= maxYuan);

  if (yuanExchanges.length > 0) {
    templates.push(() => {
      const ex = randomChoice(yuanExchanges);
      return {
        expr: `1张${ex.a}元可以换`,
        ansHtml: `( <span class="ans-val">${ex.ans}</span> )张${ex.b}元`,
        key: `ex_y2y_${ex.a}_${ex.b}`
      };
    });
  }

  // E2: 1张5角可以换( )张1角 (包含角)
  if (includeJiao) {
    templates.push(() => {
      return {
        expr: `1张5角可以换`,
        ansHtml: `( <span class="ans-val">5</span> )张1角`,
        key: "ex_j2j_5_1"
      };
    });
  }

  // E3: 1张X元可以换( )张Y角 (包含角)
  if (includeJiao) {
    const yuanToJiaoExchanges = [
      { a: 1, b: 1, ans: 10 },
      { a: 1, b: 5, ans: 2 },
      { a: 2, b: 1, ans: 20 },
      { a: 2, b: 5, ans: 4 },
      { a: 5, b: 1, ans: 50 },
      { a: 5, b: 5, ans: 10 }
    ].filter(ex => ex.a <= maxYuan);

    if (yuanToJiaoExchanges.length > 0) {
      templates.push(() => {
        const ex = randomChoice(yuanToJiaoExchanges);
        return {
          expr: `1张${ex.a}元可以换`,
          ansHtml: `( <span class="ans-val">${ex.ans}</span> )张${ex.b}角`,
          key: `ex_y2j_${ex.a}_${ex.b}`
        };
      });
    }
  }

  // E4: 1张X角可以换( )枚Y分 (包含角和分)
  if (includeJiao && includeFen) {
    templates.push(() => {
      const jiao = randomChoice([1, 5]);
      const ans = jiao * 10;
      return {
        expr: `1张${jiao}角可以换`,
        ansHtml: `( <span class="ans-val">${ans}</span> )枚1分`,
        key: `ex_j2f_${jiao}_1`
      };
    });
  }

  // E5: 1张1元可以换( )枚1分 (包含分)
  if (includeFen && maxYuan >= 1) {
    templates.push(() => {
      return {
        expr: `1张1元可以换`,
        ansHtml: `( <span class="ans-val">100</span> )枚1分`,
        key: "ex_y2f_1_1"
      };
    });
  }

  // 回退保护
  if (templates.length === 0) {
    return {
      expr: "1张2元可以换",
      ansHtml: `( <span class="ans-val">2</span> )张1元`,
      key: "fallback_ex_2_1"
    };
  }

  const t = randomChoice(templates);
  return t();
}

/**
 * 核心渲染函数
 */
function renderWorksheet() {
  const opType = document.querySelector('input[name="op-type"]:checked').value;
  const maxYuan = parseInt(document.querySelector('input[name="max-yuan"]:checked').value, 10);
  const includeJiao = document.getElementById('include-jiao').checked;
  const includeFen = document.getElementById('include-fen').checked;
  const count = parseInt(document.getElementById('questions-count').value, 10);

  const questions = [];
  const questionSet = new Set();
  let failCount = 0;

  while (questions.length < count && failCount < 300) {
    let q;
    // 题型分发
    if (opType === 'convert') {
      q = generateConversion(maxYuan, includeJiao, includeFen);
    } else if (opType === 'arithmetic') {
      q = generateArithmetic(maxYuan, includeJiao, includeFen);
    } else if (opType === 'exchange') {
      q = generateExchange(maxYuan, includeJiao, includeFen);
    } else {
      // 混合
      const rand = Math.random();
      if (rand < 0.4) {
        q = generateConversion(maxYuan, includeJiao, includeFen);
      } else if (rand < 0.8) {
        q = generateArithmetic(maxYuan, includeJiao, includeFen);
      } else {
        q = generateExchange(maxYuan, includeJiao, includeFen);
      }
    }

    if (!questionSet.has(q.key)) {
      questionSet.add(q.key);
      questions.push(q);
      failCount = 0; // 重置防堵计数器
    } else {
      failCount++;
    }
  }

  // 如果去重后题目不足，则允许一定重复，强行补足
  if (questions.length < count) {
    let protection = 0;
    while (questions.length < count && protection < 200) {
      let q;
      if (opType === 'convert') q = generateConversion(maxYuan, includeJiao, includeFen);
      else if (opType === 'arithmetic') q = generateArithmetic(maxYuan, includeJiao, includeFen);
      else if (opType === 'exchange') q = generateExchange(maxYuan, includeJiao, includeFen);
      else {
        const rand = Math.random();
        if (rand < 0.4) q = generateConversion(maxYuan, includeJiao, includeFen);
        else if (rand < 0.8) q = generateArithmetic(maxYuan, includeJiao, includeFen);
        else q = generateExchange(maxYuan, includeJiao, includeFen);
      }
      questions.push(q);
      protection++;
    }
  }

  const sheetGrid = document.getElementById('sheet-grid');
  sheetGrid.innerHTML = '';

  // 元角分题型排版采用 2 列
  const colCount = 2;
  const itemsPerCol = Math.ceil(questions.length / colCount);

  for (let col = 0; col < colCount; col++) {
    const colElement = document.createElement('div');
    colElement.className = 'grid-col';
    // 限制高度
    colElement.style.minHeight = '750px';

    for (let row = 0; row < itemsPerCol; row++) {
      const idx = col * itemsPerCol + row;
      if (idx < questions.length) {
        const q = questions[idx];
        const rowElement = document.createElement('div');
        rowElement.className = 'formula-row row-left';
        
        rowElement.innerHTML = `
          <span class="formula-expr">${q.expr}</span>
          <span class="formula-ans">${q.ansHtml}</span>
        `;
        colElement.appendChild(rowElement);
      }
    }
    sheetGrid.appendChild(colElement);

    // 插入垂直分隔线
    if (col < colCount - 1) {
      const divider = document.createElement('div');
      divider.className = 'grid-divider';
      sheetGrid.appendChild(divider);
    }
  }
}

// 绑定 DOM 交互逻辑
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate');
    const btnToggleAnswer = document.getElementById('btn-toggle-answer');
    const btnPrint = document.getElementById('btn-print');
    const sheetContainer = document.getElementById('sheet-container');

    let showAnswers = false;

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

    // 自动初始化渲染题目
    renderWorksheet();
  });
}

// 导出模块用于单元测试
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateConversion,
    generateArithmetic,
    generateExchange
  };
}
