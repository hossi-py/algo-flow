import heapq


def solution(n, flights, src, dst, k):
    graph = [[] for _ in range(n)]
    for a, b, p in flights:
        graph[a].append((b, p))
    INF = float("inf")
    dist = [[INF] * (k + 2) for _ in range(n)]
    dist[src][0] = 0
    heap = [(0, src, 0)]
    while heap:
        cost, v, used = heapq.heappop(heap)
        if v == dst:
            return cost
        if cost > dist[v][used] or used == k + 1:
            continue
        for w, p in graph[v]:
            nc = cost + p
            if nc < dist[w][used + 1]:
                dist[w][used + 1] = nc
                heapq.heappush(heap, (nc, w, used + 1))
    return -1
