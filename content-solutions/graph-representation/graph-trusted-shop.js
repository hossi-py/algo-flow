function solution(n, recs) {
  const inn = new Array(n + 1).fill(0);
  const out = new Array(n + 1).fill(0);
  for (const [a, b] of recs) {
    out[a] += 1;
    inn[b] += 1;
  }
  for (let x = 1; x <= n; x += 1) {
    if (inn[x] === n - 1 && out[x] === 0) return x;
  }
  return -1;
}
