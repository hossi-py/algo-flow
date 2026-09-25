function solution(n, roads) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const dist = new Array(n).fill(0);
  function dfs(v, parent, d) {
    dist[v] = d;
    for (const w of graph[v]) {
      if (w !== parent) dfs(w, v, d + 1);
    }
  }
  function farthest(s) {
    dfs(s, -1, 0);
    let best = 0;
    for (let v = 1; v < n; v += 1) if (dist[v] > dist[best]) best = v;
    return [best, dist[best]];
  }
  const [a] = farthest(0);
  return farthest(a)[1];
}
