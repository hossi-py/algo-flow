from collections import deque


def solution(n, pairs, start):
    graph = [[] for _ in range(n)]
    for a, b in pairs:
        graph[a].append(b)
        graph[b].append(a)
    for neighbors in graph:
        neighbors.sort()
    visited = [False] * n
    visited[start] = True
    queue = deque([start])
    order = []
    while queue:
        v = queue.popleft()
        order.append(v)
        for w in graph[v]:
            if not visited[w]:
                visited[w] = True
                queue.append(w)
    return order
