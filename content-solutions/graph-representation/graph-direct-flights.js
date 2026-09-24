function solution(n, flights, queries) {
  const table = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [a, b] of flights) table[a][b] = true;
  return queries.map(([s, t]) => table[s][t]);
}
