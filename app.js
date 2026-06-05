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
