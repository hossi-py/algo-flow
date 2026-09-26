from collections import deque


def solution(times, prereqs):
    n = len(times)
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prereqs:
        graph[a].append(b)
        indeg[b] += 1
    finish = times[:]
    queue = deque(v for v in range(n) if indeg[v] == 0)
    while queue:
        v = queue.popleft()
        for w in graph[v]:
            finish[w] = max(finish[w], finish[v] + times[w])
            indeg[w] -= 1
            if indeg[w] == 0:
                queue.append(w)
    return max(finish)
