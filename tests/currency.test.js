const test = require('node:test');
const assert = require('node:assert');
const { generateConversion, generateExchange } = require('../currency.js');

test('generateConversion - 包含角的情况', () => {
  for (let i = 0; i < 200; i++) {
    const q = generateConversion(100, true);
    assert.ok(q.expr.length > 0, "题目表达式不应为空");
    assert.ok(q.ansHtml.length > 0, "答案 HTML 不应为空");
    assert.ok(q.key.length > 0, "题目唯一标识 key 不应为空");
    assert.ok(q.ansHtml.includes('ans-val'), "答案应该包含 ans-val 类标识");
  }
});

test('generateConversion - 仅包含元（不含角）的安全回退', () => {
  for (let i = 0; i < 50; i++) {
    const q = generateConversion(100, false);
    assert.ok(q.expr, "回退情况下表达式不应为空");
    assert.ok(q.ansHtml, "回退情况下答案不应为空");
    assert.ok(q.key, "回退情况下key不应为空");
  }
});

test('generateExchange - 包含角的情况', () => {
  for (let i = 0; i < 200; i++) {
    const q = generateExchange(100, true);
    assert.ok(q.expr.length > 0, "兑换题表达式不应为空");
    assert.ok(q.ansHtml.length > 0, "兑换题答案 HTML 不应为空");
    assert.ok(q.key.length > 0, "兑换题key不应为空");
    assert.ok(q.ansHtml.includes('ans-val'), "兑换题答案应该包含 ans-val");
  }
});
