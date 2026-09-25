def solution(n):
    MOD = 1_000_000_007
    memo = {}

    def ways(k):
        if k <= 1:
            return 1
        if k in memo:
            return memo[k]
        memo[k] = (ways(k - 1) + 2 * ways(k - 2)) % MOD
        return memo[k]

    return ways(n)
