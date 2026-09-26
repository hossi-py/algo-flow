function solution(forest) {
  const MOD = 1_000_000_007;
  const rows = forest.length;
  const cols = forest[0].length;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (forest[r][c] === "#") continue;
      if (r === 0 && c === 0) {
        dp[r][c] = 1;
        continue;
      }
      const up = r > 0 ? dp[r - 1][c] : 0;
      const left = c > 0 ? dp[r][c - 1] : 0;
      dp[r][c] = (up + left) % MOD;
    }
  }
  return dp[rows - 1][cols - 1];
}
