class Solution {
    public int solution(String[] forest) {
        final long MOD = 1_000_000_007L;
        int rows = forest.length, cols = forest[0].length();
        long[][] dp = new long[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (forest[r].charAt(c) == '#') continue;
                if (r == 0 && c == 0) {
                    dp[r][c] = 1;
                    continue;
                }
                long up = r > 0 ? dp[r - 1][c] : 0;
                long left = c > 0 ? dp[r][c - 1] : 0;
                dp[r][c] = (up + left) % MOD;
            }
        }
        return (int) dp[rows - 1][cols - 1];
    }
}
