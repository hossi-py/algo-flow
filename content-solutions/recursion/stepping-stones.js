function solution(n) {
  const memo = new Map();
  function ways(k) {
    if (k < 0) return 0;
    if (k === 0) return 1;
    if (!memo.has(k)) memo.set(k, ways(k - 1) + ways(k - 2) + ways(k - 3));
    return memo.get(k);
  }
  return ways(n);
}
