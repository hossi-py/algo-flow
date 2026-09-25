function solution(n, trails) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of trails) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Array(n).fill(false);
  function dfs(u, parent) {
    visited[u] = true;
    for (const v of graph[u]) {
      if (v === parent) continue;
      if (visited[v]) return true;
      if (dfs(v, u)) return true;
    }
    return false;
  }
  for (let s = 0; s < n; s++) {
    if (!visited[s] && dfs(s, -1)) return true;
  }
  return false;
}
