from collections import deque


def solution(n, prereqs):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prereqs:
        graph[a].append(b)
        indeg[b] += 1
    term = [1] * n
    queue = deque(v for v in range(n) if indeg[v] == 0)
    while queue:
        v = queue.popleft()
        for w in graph[v]:
            term[w] = max(term[w], term[v] + 1)
            indeg[w] -= 1
            if indeg[w] == 0:
                queue.append(w)
    return term
