function solution(n, routes, s, t) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of routes) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const dist = new Array(n).fill(-1);
  dist[s] = 0;
  const queue = [s];
  let head = 0;
  while (head < queue.length) {
    const v = queue[head++];
    if (v === t) return dist[v];
    for (const w of graph[v]) {
      if (dist[w] === -1) {
        dist[w] = dist[v] + 1;
        queue.push(w);
      }
    }
  }
  return -1;
}
