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


def solution(n, roads, x):
    graph = [[] for _ in range(n)]
    reverse = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        reverse[b].append((a, t))
    back = dijkstra(graph, x)
    go = dijkstra(reverse, x)
    return max(go[v] + back[v] for v in range(n))
