def solution(n, roads, start):
    graph = [[] for _ in range(n)]
    for a, b in roads:
        graph[a].append(b)
    visited = [False] * n
    visited[start] = True
    stack = [start]
    while stack:
        u = stack.pop()
        for v in graph[u]:
            if not visited[v]:
                visited[v] = True
                stack.append(v)
    return [i for i in range(n) if visited[i] and i != start]
