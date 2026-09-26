function solution(heights) {
  const a = [...heights];
  let swaps = 0;
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      swaps++;
    }
  }
  return swaps;
}
