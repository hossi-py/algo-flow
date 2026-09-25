def solution(n):
    memo = {}

    def ways(k):
        if k < 0:
            return 0
        if k == 0:
            return 1
        if k not in memo:
            memo[k] = ways(k - 1) + ways(k - 2) + ways(k - 3)
        return memo[k]

    return ways(n)
