function solution(n, roads) {
  const out = new Array(n).fill(0);
  const inn = new Array(n).fill(0);
  for (const [a, b] of roads) {
    out[a] += 1;
    inn[b] += 1;
  }
  return out.map((o, i) => [o, inn[i]]);
}
