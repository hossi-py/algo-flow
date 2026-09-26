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


def solution(n, roads, a, b):
    graph = [[] for _ in range(n)]
    for u, v, t in roads:
        graph[u].append((v, t))
        graph[v].append((u, t))
    d0, da, db = dijkstra(graph, 0), dijkstra(graph, a), dijkstra(graph, b)
    first = d0[a] + da[b] + db[n - 1]
    second = d0[b] + db[a] + da[n - 1]
    best = min(first, second)
    return -1 if best == INF else best
