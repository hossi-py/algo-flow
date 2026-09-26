import heapq


def solution(n, roads, s, e):
    graph = [[] for _ in range(n)]
    for a, b, c in roads:
        graph[a].append((b, c))
        graph[b].append((a, c))
    dist = [float("inf")] * n
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, v = heapq.heappop(heap)
        if v == e:
            return d
        if d > dist[v]:
            continue
        for w, c in graph[v]:
            if d + c < dist[w]:
                dist[w] = d + c
                heapq.heappush(heap, (dist[w], w))
    return -1
