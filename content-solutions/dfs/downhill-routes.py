def solution(n, trails):
    MOD = 1_000_000_007
    graph = [[] for _ in range(n)]
    for a, b in trails:
        graph[a].append(b)
    memo = [-1] * n

    def ways(v):
        if v == n - 1:
            return 1
        if memo[v] != -1:
            return memo[v]
        total = 0
        for w in graph[v]:
            total = (total + ways(w)) % MOD
        memo[v] = total
        return total

    return ways(0)
