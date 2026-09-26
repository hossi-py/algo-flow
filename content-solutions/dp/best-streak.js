function solution(profits) {
  let cur = profits[0];
  let best = profits[0];
  for (let i = 1; i < profits.length; i++) {
    cur = Math.max(profits[i], cur + profits[i]);
    best = Math.max(best, cur);
  }
  return best;
}
