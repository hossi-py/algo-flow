function solution(cost) {
  const best = [...cost];
  for (let i = 2; i < cost.length; i++) best[i] = Math.min(best[i - 1], best[i - 2]) + cost[i];
  return Math.min(best[best.length - 1], best[best.length - 2]);
}
