function solution(n, roads, start, stores) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of roads) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const isStore = new Set(stores);
  const dist = new Array(n).fill(-1);
  dist[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    if (isStore.has(u)) return dist[u];
    for (const v of graph[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return -1;
}
