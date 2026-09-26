function solution(nums) {
  const s = new Set(nums);
  let best = 0;
  for (const x of s) {
    if (!s.has(x - 1)) {
      let length = 1;
      while (s.has(x + length)) length++;
      best = Math.max(best, length);
    }
  }
  return best;
}
