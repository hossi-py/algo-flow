import heapq

MOD = 1_000_000_007


def solution(n, roads):
    graph = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        graph[b].append((a, t))
    dist = [float("inf")] * n
    ways = [0] * n
    dist[0] = 0
    ways[0] = 1
    heap = [(0, 0)]
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for w, t in graph[v]:
            if d + t < dist[w]:
                dist[w] = d + t
                ways[w] = ways[v]
                heapq.heappush(heap, (dist[w], w))
            elif d + t == dist[w]:
                ways[w] = (ways[w] + ways[v]) % MOD
    return ways[n - 1]
