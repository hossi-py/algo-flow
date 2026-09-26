function solution(scores, k, threshold) {
  const need = threshold * k;
  let window = 0;
  for (let i = 0; i < k; i++) window += scores[i];
  let count = window >= need ? 1 : 0;
  for (let i = k; i < scores.length; i++) {
    window += scores[i] - scores[i - k];
    if (window >= need) count++;
  }
  return count;
}
