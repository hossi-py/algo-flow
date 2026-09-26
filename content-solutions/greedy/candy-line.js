function solution(scores) {
  const n = scores.length;
  const candy = Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (scores[i] > scores[i - 1]) candy[i] = candy[i - 1] + 1;
  }
  for (let i = n - 2; i >= 0; i--) {
    if (scores[i] > scores[i + 1]) candy[i] = Math.max(candy[i], candy[i + 1] + 1);
  }
  return candy.reduce((a, b) => a + b, 0);
}
