function solution(n, prereqs) {
  const graph = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of prereqs) {
    graph[a].push(b);
    indeg[b]++;
  }
  const term = new Array(n).fill(1);
  const queue = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) queue.push(v);
  for (let head = 0; head < queue.length; head++) {
    const v = queue[head];
    for (const w of graph[v]) {
      term[w] = Math.max(term[w], term[v] + 1);
      if (--indeg[w] === 0) queue.push(w);
    }
  }
  return term;
}
