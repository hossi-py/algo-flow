from collections import deque


def solution(n, links, start):
    graph = [[] for _ in range(n)]
    for a, b in links:
        graph[a].append(b)
        graph[b].append(a)
    dist = [-1] * n
    dist[start] = 0
    queue = deque([start])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)
    rings = [[] for _ in range(max(dist) + 1)]
    for i in range(n):
        if dist[i] >= 0:
            rings[dist[i]].append(i)
    return rings
