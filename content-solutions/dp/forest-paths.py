def solution(forest):
    MOD = 1_000_000_007
    rows, cols = len(forest), len(forest[0])
    dp = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if forest[r][c] == "#":
                continue
            if r == 0 and c == 0:
                dp[r][c] = 1
                continue
            up = dp[r - 1][c] if r > 0 else 0
            left = dp[r][c - 1] if c > 0 else 0
            dp[r][c] = (up + left) % MOD
    return dp[rows - 1][cols - 1]
