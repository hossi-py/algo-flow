from collections import deque


def solution(n, routes, s, t):
    graph = [[] for _ in range(n)]
    for a, b in routes:
        graph[a].append(b)
        graph[b].append(a)
    dist = [-1] * n
    dist[s] = 0
    queue = deque([s])
    while queue:
        v = queue.popleft()
        if v == t:
            return dist[v]
        for w in graph[v]:
            if dist[w] == -1:
                dist[w] = dist[v] + 1
                queue.append(w)
    return -1
