function solution(n, borders, k) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of borders) {
    graph[a].push(b);
    graph[b].push(a);
  }
  const color = new Array(n).fill(-1);
  function paint(v) {
    if (v === n) return 1;
    let count = 0;
    for (let c = 0; c < k; c += 1) {
      if (graph[v].some((w) => color[w] === c)) continue;
      color[v] = c;
      count += paint(v + 1);
      color[v] = -1;
    }
    return count;
  }
  return paint(0);
}
