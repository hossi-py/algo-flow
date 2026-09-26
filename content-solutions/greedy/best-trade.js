function solution(prices) {
  let lowest = Infinity;
  let best = 0;
  for (const p of prices) {
    best = Math.max(best, p - lowest);
    lowest = Math.min(lowest, p);
  }
  return best;
}
