function solution(n) {
  const memo = new Map();
  function rabbits(m) {
    if (m <= 2) return 1;
    if (memo.has(m)) return memo.get(m);
    const value = rabbits(m - 1) + rabbits(m - 2);
    memo.set(m, value);
    return value;
  }
  return rabbits(n);
}
