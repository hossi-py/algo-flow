function solution(walls) {
  let l = 0;
  let r = walls.length - 1;
  let best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(walls[l], walls[r]) * (r - l));
    if (walls[l] < walls[r]) l++;
    else r--;
  }
  return best;
}
