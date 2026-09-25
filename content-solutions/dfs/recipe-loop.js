function solution(n, rules) {
  const graph = Array.from({ length: n }, () => []);
  for (const [a, b] of rules) graph[a].push(b);
  const state = new Array(n).fill(0);
  function hasCycle(v) {
    state[v] = 1;
    for (const w of graph[v]) {
      if (state[w] === 1) return true;
      if (state[w] === 0 && hasCycle(w)) return true;
    }
    state[v] = 2;
    return false;
  }
  for (let v = 0; v < n; v += 1) {
    if (state[v] === 0 && hasCycle(v)) return false;
  }
  return true;
}
