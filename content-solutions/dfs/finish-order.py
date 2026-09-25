def solution(n, tunnels):
    graph = [[] for _ in range(n)]
    for a, b in tunnels:
        graph[a].append(b)
        graph[b].append(a)
    for rooms in graph:
        rooms.sort()
    visited = [False] * n
    answer = []

    def dfs(u):
        visited[u] = True
        for v in graph[u]:
            if not visited[v]:
                dfs(v)
        answer.append(u)

    dfs(0)
    return answer
