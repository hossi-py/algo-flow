function solution(n, prereqs) {
  const graph = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of prereqs) {
    graph[a].push(b);
    indeg[b]++;
  }
  const queue = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) queue.push(v);
  for (let head = 0; head < queue.length; head++) {
    const v = queue[head];
    for (const w of graph[v]) {
      if (--indeg[w] === 0) queue.push(w);
    }
  }
  return queue.length;
}
