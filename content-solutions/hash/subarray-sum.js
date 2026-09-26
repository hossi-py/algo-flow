function solution(nums, k) {
  const seen = new Map([[0, 1]]);
  let total = 0;
  let answer = 0;
  for (const x of nums) {
    total += x;
    answer += seen.get(total - k) ?? 0;
    seen.set(total, (seen.get(total) ?? 0) + 1);
  }
  return answer;
}
