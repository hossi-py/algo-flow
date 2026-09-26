function solution(pyramid) {
  const best = [...pyramid[pyramid.length - 1]];
  for (let r = pyramid.length - 2; r >= 0; r--) {
    for (let c = 0; c <= r; c++) best[c] = pyramid[r][c] + Math.max(best[c], best[c + 1]);
  }
  return best[0];
}
