function solution(n, links, start) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of links) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const dist = new Array(n).fill(-1);
  dist[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of graph[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  const rings = Array.from({ length: Math.max(...dist) + 1 }, () => []);
  for (let i = 0; i < n; i++) if (dist[i] >= 0) rings[dist[i]].push(i);
  return rings;
}
