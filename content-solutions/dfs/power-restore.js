function solution(n, wires, plant) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of wires) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const visited = new Array(n).fill(false);
  function dfs(v) {
    visited[v] = true;
    let count = 1;
    for (const w of graph[v]) {
      if (!visited[w]) count += dfs(w);
    }
    return count;
  }
  return dfs(plant);
}
