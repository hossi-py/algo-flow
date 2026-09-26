function solution(positions) {
  const p = [...positions].sort((a, b) => a - b);
  let best = Infinity;
  for (let i = 1; i < p.length; i++) best = Math.min(best, p[i] - p[i - 1]);
  return best;
}
