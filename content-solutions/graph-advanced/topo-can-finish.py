from collections import deque


def solution(n, prereqs):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prereqs:
        graph[a].append(b)
        indeg[b] += 1
    queue = deque(v for v in range(n) if indeg[v] == 0)
    done = 0
    while queue:
        v = queue.popleft()
        done += 1
        for w in graph[v]:
            indeg[w] -= 1
            if indeg[w] == 0:
                queue.append(w)
    return done
