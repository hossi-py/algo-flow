function solution(n, trails) {
  const degree = new Array(n).fill(0);
  for (const [a, b] of trails) {
    degree[a] += 1;
    degree[b] += 1;
  }
  const odd = degree.filter((d) => d % 2 === 1).length;
  return odd === 0 || odd === 2;
}
