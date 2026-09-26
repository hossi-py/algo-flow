function solution(ropes) {
  const r = [...ropes].sort((a, b) => b - a);
  let best = 0;
  for (let k = 1; k <= r.length; k++) best = Math.max(best, r[k - 1] * k);
  return best;
}
