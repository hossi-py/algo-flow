function solution(apples, roads) {
  const n = apples.length;
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const total = apples.reduce((x, y) => x + y, 0);
  let best = total;
  function dfs(u, parent) {
    let s = apples[u];
    for (const v of graph[u]) {
      if (v !== parent) s += dfs(v, u);
    }
    if (parent !== -1) best = Math.min(best, Math.abs(total - 2 * s));
    return s;
  }
  dfs(0, -1);
  return best;
}
