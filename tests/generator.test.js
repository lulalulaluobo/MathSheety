const test = require('node:test');
const assert = require('node:assert');
const { generateAddition, generateSubtraction } = require('../app.js');

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
