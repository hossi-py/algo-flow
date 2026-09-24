function solution(n, pairs) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    graph[a].push(b);
    graph[b].push(a);
  }
  for (const friends of graph) friends.sort((p, q) => p - q);
  return graph;
}
