function solution(n) {
  const MOD = 1_000_000_007;
  const memo = new Map();
  function ways(k) {
    if (k <= 1) return 1;
    if (memo.has(k)) return memo.get(k);
    const value = (ways(k - 1) + 2 * ways(k - 2)) % MOD;
    memo.set(k, value);
    return value;
  }
  return ways(n);
}
