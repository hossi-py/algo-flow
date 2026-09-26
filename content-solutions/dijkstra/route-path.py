import heapq


def solution(n, roads, s, e):
    graph = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        graph[b].append((a, t))
    dist = [float("inf")] * n
    prev = [-1] * n
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for w, t in graph[v]:
            if d + t < dist[w]:
                dist[w] = d + t
                prev[w] = v
                heapq.heappush(heap, (dist[w], w))
    if dist[e] == float("inf"):
        return []
    path = []
    v = e
    while v != -1:
        path.append(v)
        v = prev[v]
    return path[::-1]
