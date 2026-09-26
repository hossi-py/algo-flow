function solution(code) {
  const MOD = 1_000_000_007;
  const n = code.length;
  const ways = Array(n + 1).fill(0);
  ways[0] = 1;
  for (let i = 1; i <= n; i++) {
    if (code[i - 1] !== "0") ways[i] += ways[i - 1];
    if (i >= 2) {
      const two = Number(code.slice(i - 2, i));
      if (two >= 10 && two <= 26) ways[i] += ways[i - 2];
    }
    ways[i] %= MOD;
  }
  return ways[n];
}
