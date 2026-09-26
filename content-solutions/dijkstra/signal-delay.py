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


def solution(n, links, start):
    graph = [[] for _ in range(n)]
    for a, b, t in links:
        graph[a].append((b, t))
    dist = dijkstra(graph, start)
    longest = max(dist)
    return -1 if longest == INF else longest
