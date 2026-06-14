const test = require('node:test');
const assert = require('node:assert');
const { generateConversion, generateArithmetic, generateExchange } = require('../currency.js');

test('generateConversion - 包含角和分的情况', () => {
  for (let i = 0; i < 200; i++) {
    const q = generateConversion(100, true, true);
    assert.ok(q.expr.length > 0, "题目表达式不应为空");
    assert.ok(q.ansHtml.length > 0, "答案 HTML 不应为空");
    assert.ok(q.key.length > 0, "题目唯一标识 key 不应为空");
    assert.ok(q.ansHtml.includes('ans-val'), "答案应该包含 ans-val 类标识");
  }
});

test('generateConversion - 仅包含元（不含角分）的安全回退', () => {
  for (let i = 0; i < 50; i++) {
    const q = generateConversion(100, false, false);
    assert.ok(q.expr, "回退情况下表达式不应为空");
    assert.ok(q.ansHtml, "回退情况下答案不应为空");
    assert.ok(q.key, "回退情况下key不应为空");
  }
});

test('generateArithmetic - 包含角和分的情况', () => {
  for (let i = 0; i < 200; i++) {
    const q = generateArithmetic(100, true, true);
    assert.ok(q.expr.length > 0, "计算题表达式不应为空");
    assert.ok(q.ansHtml.length > 0, "计算题答案 HTML 不应为空");
    assert.ok(q.key.length > 0, "计算题key不应为空");
    assert.ok(q.ansHtml.includes('ans-val'), "计算题答案应该包含 ans-val");
  }
});

test('generateExchange - 包含角和分的情况', () => {
  for (let i = 0; i < 200; i++) {
    const q = generateExchange(100, true, true);
    assert.ok(q.expr.length > 0, "兑换题表达式不应为空");
    assert.ok(q.ansHtml.length > 0, "兑换题答案 HTML 不应为空");
    assert.ok(q.key.length > 0, "兑换题key不应为空");
    assert.ok(q.ansHtml.includes('ans-val'), "兑换题答案应该包含 ans-val");
  }
});
