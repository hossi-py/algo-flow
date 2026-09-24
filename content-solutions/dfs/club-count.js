function solution(n, pairs) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Array(n).fill(false);
  function dfs(v) {
    visited[v] = true;
    for (const w of graph[v]) {
      if (!visited[w]) dfs(w);
    }
  }
  let count = 0;
  for (let v = 0; v < n; v += 1) {
    if (!visited[v]) {
      count += 1;
      dfs(v);
    }
  }
  return count;
}
