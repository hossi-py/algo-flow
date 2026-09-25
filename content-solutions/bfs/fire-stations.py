from collections import deque


def solution(n, roads, stations):
    graph = [[] for _ in range(n)]
    for a, b in roads:
        graph[a].append(b)
        graph[b].append(a)
    dist = [-1] * n
    queue = deque()
    for s in stations:
        dist[s] = 0
        queue.append(s)
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)
    return -1 if -1 in dist else max(dist)
