const test = require('node:test');
const assert = require('node:assert');
const { generateAddition, generateSubtraction, generateMultiplication, generateDivision, generateThreeTerm } = require('../app.js');

test('generateAddition - no carry within 20', () => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const q = generateAddition(20, false);
    assert.ok(q.res <= 20, `Result ${q.res} exceeds 20`);
    assert.ok((q.a % 10) + (q.b % 10) < 10, `Addition a=${q.a}, b=${q.b} should not carry`);
    assert.equal(q.a + q.b, q.res);
    results.push(q);
  }
  // 确保生成的算式不是全部为 0，测试应当能够生成一些非零数
  const hasNonZero = results.some(q => q.a > 0 || q.b > 0);
  assert.ok(hasNonZero, "Should generate non-zero equations");
});

test('generateSubtraction - no borrow within 20', () => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const q = generateSubtraction(20, false);
    assert.ok(q.a <= 20, `Minuend ${q.a} exceeds 20`);
    assert.ok(q.a >= q.b, `Minuend ${q.a} must be >= Subtrahend ${q.b}`);
    assert.ok((q.a % 10) >= (q.b % 10), `Subtraction a=${q.a}, b=${q.b} should not borrow`);
    assert.equal(q.a - q.b, q.res);
    results.push(q);
  }
  // 确保生成的算式不是全部为 0，测试应当能够生成一些非零数
  const hasNonZero = results.some(q => q.a > 0 || q.b > 0);
  assert.ok(hasNonZero, "Should generate non-zero equations");
});

test('generateMultiplication - 九九表内 (因子 1..9)', () => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const q = generateMultiplication();
    assert.ok(q.a >= 1 && q.a <= 9, `Factor a=${q.a} out of 1..9`);
    assert.ok(q.b >= 1 && q.b <= 9, `Factor b=${q.b} out of 1..9`);
    assert.ok(q.res <= 81, `Product ${q.res} exceeds 81`);
    assert.equal(q.a * q.b, q.res, `Multiplication a=${q.a}, b=${q.b} mismatch`);
    results.push(q);
  }
  // 确保生成的算式不是全部为 0，测试应当能够生成一些非零数
  const hasNonZero = results.some(q => q.a > 0 || q.b > 0);
  assert.ok(hasNonZero, "Should generate non-zero equations");
});

test('generateDivision - 九九表内整除无余数 (除数、商均在 1..9)', () => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const q = generateDivision();
    assert.ok(q.a >= 1 && q.a <= 81, `Dividend a=${q.a} out of 1..81`);
    assert.ok(q.b >= 1 && q.b <= 9, `Divisor b=${q.b} out of 1..9`);
    assert.ok(q.res >= 1 && q.res <= 9, `Quotient ${q.res} out of 1..9`);
    assert.equal(q.a % q.b, 0, `Division a=${q.a}, b=${q.b} has remainder`);
    assert.equal(q.a / q.b, q.res, `Division a=${q.a}, b=${q.b} mismatch`);
    results.push(q);
  }
  // 确保生成的算式不是全部为 0，测试应当能够生成一些非零数
  const hasNonZero = results.some(q => q.a > 0 || q.b > 0);
  assert.ok(hasNonZero, "Should generate non-zero equations");
});

test('generateThreeTerm - 结果不超过 20 且中间结果不为负', () => {
  const range = 20;
  const seenPatterns = new Set();
  for (let i = 0; i < 100; i++) {
    const q = generateThreeTerm(range);
    assert.ok(q.ops && q.ops.length === 2, `ops should have two operators`);
    seenPatterns.add(q.ops.join(''));

    // 从左到右逐步运算，校验中间结果 ≥ 0 且最终结果 = res
    let acc = q.a;
    assert.ok(acc >= 0, `a=${q.a} should be non-negative`);
    const steps = [q.b, q.c];
    for (let s = 0; s < q.ops.length; s++) {
      acc = q.ops[s] === '+' ? acc + steps[s] : acc - steps[s];
      assert.ok(acc >= 0, `Intermediate result ${acc} < 0 for a=${q.a} ops=${q.ops} b=${q.b} c=${q.c}`);
    }
    assert.ok(acc <= range, `Final result ${acc} exceeds ${range}`);
    assert.equal(acc, q.res, `Final result mismatch for a=${q.a} ops=${q.ops} b=${q.b} c=${q.c}`);
  }
  // 四种形式（连加/连减/加减混合 x2）应在足够样本中出现
  assert.ok(seenPatterns.size >= 2, `Should produce multiple operation patterns, got ${[...seenPatterns]}`);
});
