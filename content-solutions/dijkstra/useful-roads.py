import heapq

INF = float("inf")


def dijkstra(graph, start):
    dist = [INF] * len(graph)
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for w, t in graph[v]:
            if d + t < dist[w]:
                dist[w] = d + t
                heapq.heappush(heap, (dist[w], w))
    return dist


def solution(n, roads):
    graph = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        graph[b].append((a, t))
    ds = dijkstra(graph, 0)
    de = dijkstra(graph, n - 1)
    total = ds[n - 1]
    if total == INF:
        return 0
    count = 0
    for u, v, t in roads:
        if ds[u] + t + de[v] == total or ds[v] + t + de[u] == total:
            count += 1
    return count
