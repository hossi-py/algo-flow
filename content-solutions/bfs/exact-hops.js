function solution(n, pairs, me, k) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const dist = new Array(n).fill(-1);
  dist[me] = 0;
  const queue = [me];
  let head = 0;
  while (head < queue.length) {
    const v = queue[head++];
    for (const w of graph[v]) {
      if (dist[w] === -1) {
        dist[w] = dist[v] + 1;
        queue.push(w);
      }
    }
  }
  const answer = [];
  for (let i = 0; i < n; i += 1) if (dist[i] === k) answer.push(i);
  return answer;
}
