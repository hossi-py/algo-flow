function solution(profits, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += profits[i];
  let best = window;
  for (let i = k; i < profits.length; i++) {
    window += profits[i] - profits[i - k];
    best = Math.max(best, window);
  }
  return best;
}
