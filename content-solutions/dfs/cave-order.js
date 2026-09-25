function solution(n, tunnels, start) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of tunnels) {
    graph[a].push(b);
    graph[b].push(a);
  }
  for (const neighbors of graph) neighbors.sort((p, q) => p - q);
  const visited = new Array(n).fill(false);
  const order = [];
  function dfs(v) {
    visited[v] = true;
    order.push(v);
    for (const w of graph[v]) {
      if (!visited[w]) dfs(w);
    }
  }
  dfs(start);
  return order;
}
