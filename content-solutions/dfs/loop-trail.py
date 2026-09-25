def solution(n, trails):
    graph = [[] for _ in range(n)]
    for a, b in trails:
        graph[a].append(b)
        graph[b].append(a)
    visited = [False] * n

    def dfs(u, parent):
        visited[u] = True
        for v in graph[u]:
            if v == parent:
                continue
            if visited[v]:
                return True
            if dfs(v, u):
                return True
        return False

    for s in range(n):
        if not visited[s] and dfs(s, -1):
            return True
    return False
