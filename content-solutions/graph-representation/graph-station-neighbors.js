function solution(n, edges, x) {
  const result = [];
  for (const [a, b] of edges) {
    if (a === x) result.push(b);
    else if (b === x) result.push(a);
  }
  return result.sort((p, q) => p - q);
}
