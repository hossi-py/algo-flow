import heapq

INF = float("inf")


def solution(n, roads, shelters):
    graph = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        graph[b].append((a, t))
    dist = [INF] * n
    heap = []
    for s in shelters:
        dist[s] = 0
        heap.append((0, s))
    heapq.heapify(heap)
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for w, t in graph[v]:
            if d + t < dist[w]:
                dist[w] = d + t
                heapq.heappush(heap, (dist[w], w))
    return [d if d != INF else -1 for d in dist]
