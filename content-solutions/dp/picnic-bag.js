function solution(weights, values, limit) {
  const best = Array(limit + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = limit; w >= weights[i]; w--) {
      best[w] = Math.max(best[w], best[w - weights[i]] + values[i]);
    }
  }
  return best[limit];
}
