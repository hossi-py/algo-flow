function solution(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  let best = Infinity;
  for (let i = 0; i < nums.length - 1; i++) {
    left += nums[i];
    best = Math.min(best, Math.abs(left - (total - left)));
  }
  return best;
}
