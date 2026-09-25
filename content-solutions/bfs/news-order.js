function solution(n, pairs, start) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    graph[a].push(b);
    graph[b].push(a);
  }
  for (const neighbors of graph) neighbors.sort((p, q) => p - q);
  const visited = new Array(n).fill(false);
  visited[start] = true;
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const v = queue[head++];
    for (const w of graph[v]) {
      if (!visited[w]) {
        visited[w] = true;
        queue.push(w);
      }
    }
  }
  return queue;
}
