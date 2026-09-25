def solution(apples, roads):
    n = len(apples)
    graph = [[] for _ in range(n)]
    for a, b in roads:
        graph[a].append(b)
        graph[b].append(a)
    total = sum(apples)
    best = total

    def dfs(u, parent):
        nonlocal best
        s = apples[u]
        for v in graph[u]:
            if v != parent:
                s += dfs(v, u)
        if parent != -1:
            best = min(best, abs(total - 2 * s))
        return s

    dfs(0, -1)
    return best
