function solution(acorns, S) {
  let l = 0;
  let total = 0;
  let best = Infinity;
  for (let r = 0; r < acorns.length; r++) {
    total += acorns[r];
    while (total >= S) {
      best = Math.min(best, r - l + 1);
      total -= acorns[l++];
    }
  }
  return best === Infinity ? 0 : best;
}
