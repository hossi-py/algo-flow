function solution(prices) {
  let best = 0;
  let low = prices[0];
  for (const p of prices) {
    best = Math.max(best, p - low);
    low = Math.min(low, p);
  }
  return best;
}
