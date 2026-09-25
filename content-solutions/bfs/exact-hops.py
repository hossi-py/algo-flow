from collections import deque


def solution(n, pairs, me, k):
    graph = [[] for _ in range(n)]
    for a, b in pairs:
        graph[a].append(b)
        graph[b].append(a)
    dist = [-1] * n
    dist[me] = 0
    queue = deque([me])
    while queue:
        v = queue.popleft()
        for w in graph[v]:
            if dist[w] == -1:
                dist[w] = dist[v] + 1
                queue.append(w)
    return [i for i in range(n) if dist[i] == k]
