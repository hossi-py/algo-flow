def solution(n):
    memo = {}

    def rabbits(m):
        if m <= 2:
            return 1
        if m in memo:
            return memo[m]
        memo[m] = rabbits(m - 1) + rabbits(m - 2)
        return memo[m]

    return rabbits(n)
