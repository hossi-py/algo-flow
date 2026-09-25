function solution(n, pairs, u, v) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const friendsU = new Set(graph[u]);
  return graph[v].filter((x) => friendsU.has(x)).sort((p, q) => p - q);
}
