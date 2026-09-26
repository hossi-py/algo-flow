function solution(nums) {
  const u = [...new Set(nums)].sort((a, b) => a - b);
  const rank = new Map(u.map((v, i) => [v, i]));
  return nums.map((x) => rank.get(x));
}
