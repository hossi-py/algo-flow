function solution(n, bars) {
  const at = Array.from({ length: n }, (_, i) => i);
  for (const [, col] of [...bars].sort((a, b) => a[0] - b[0] || a[1] - b[1])) {
    [at[col], at[col + 1]] = [at[col + 1], at[col]];
  }
  const answer = new Array(n).fill(0);
  for (let col = 0; col < n; col++) answer[at[col]] = col;
  return answer;
}
