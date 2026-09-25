def solution(n, pairs):
    graph = [[] for _ in range(n)]
    for a, b in pairs:
        graph[a].append(b)
        graph[b].append(a)
    visited = [False] * n

    def dfs(v):
        visited[v] = True
        for w in graph[v]:
            if not visited[w]:
                dfs(w)

    count = 0
    for v in range(n):
        if not visited[v]:
            count += 1
            dfs(v)
    return count
