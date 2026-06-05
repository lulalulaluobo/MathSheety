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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateAddition,
    generateSubtraction
  };
}
