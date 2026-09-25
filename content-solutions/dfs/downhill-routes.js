function solution(n, trails) {
  const MOD = 1_000_000_007;
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of trails) graph[a].push(b);
  const memo = new Array(n).fill(-1);
  function ways(v) {
    if (v === n - 1) return 1;
    if (memo[v] !== -1) return memo[v];
    let total = 0;
    for (const w of graph[v]) total = (total + ways(w)) % MOD;
    memo[v] = total;
    return total;
  }
  return ways(0);
}
