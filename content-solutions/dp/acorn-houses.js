function solution(acorns) {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of acorns) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
