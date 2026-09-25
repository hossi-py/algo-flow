function solution(n, tunnels) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of tunnels) {
    graph[a].push(b);
    graph[b].push(a);
  }
  for (const rooms of graph) rooms.sort((x, y) => x - y);
  const visited = new Array(n).fill(false);
  const answer = [];
  function dfs(u) {
    visited[u] = true;
    for (const v of graph[u]) {
      if (!visited[v]) dfs(v);
    }
    answer.push(u);
  }
  dfs(0);
  return answer;
}
