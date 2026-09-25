function solution(n, roads, stations) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const dist = new Array(n).fill(-1);
  const queue = [];
  for (const s of stations) {
    dist[s] = 0;
    queue.push(s);
  }
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of graph[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  let farthest = 0;
  for (const d of dist) {
    if (d === -1) return -1;
    if (d > farthest) farthest = d;
  }
  return farthest;
}
