def solution(n, tunnels, start):
    graph = [[] for _ in range(n)]
    for a, b in tunnels:
        graph[a].append(b)
        graph[b].append(a)
    for neighbors in graph:
        neighbors.sort()
    visited = [False] * n
    order = []

    def dfs(v):
        visited[v] = True
        order.append(v)
        for w in graph[v]:
            if not visited[w]:
                dfs(w)

    dfs(start)
    return order
