function solution(nums, target) {
  const a = [...nums].sort((x, y) => x - y);
  const n = a.length;
  let best = null;
  for (let i = 0; i < n - 2; i++) {
    let l = i + 1;
    let r = n - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (best === null) best = s;
      const d = Math.abs(s - target);
      const bd = Math.abs(best - target);
      if (d < bd || (d === bd && s < best)) best = s;
      if (s < target) l++;
      else if (s > target) r--;
      else return s;
    }
  }
  return best;
}
