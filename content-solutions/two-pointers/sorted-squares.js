function solution(nums) {
  const n = nums.length;
  const result = Array(n).fill(0);
  let l = 0;
  let r = n - 1;
  for (let k = n - 1; k >= 0; k--) {
    if (Math.abs(nums[l]) > Math.abs(nums[r])) {
      result[k] = nums[l] * nums[l];
      l++;
    } else {
      result[k] = nums[r] * nums[r];
      r--;
    }
  }
  return result;
}
