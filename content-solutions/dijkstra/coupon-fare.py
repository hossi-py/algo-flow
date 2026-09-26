import heapq


def solution(n, roads):
    graph = [[] for _ in range(n)]
    for a, b, t in roads:
        graph[a].append((b, t))
        graph[b].append((a, t))
    INF = float("inf")
    dist = [[INF, INF] for _ in range(n)]
    dist[0][0] = 0
    heap = [(0, 0, 0)]

    def relax(nd, w, used):
        if nd < dist[w][used]:
            dist[w][used] = nd
            heapq.heappush(heap, (nd, w, used))

    while heap:
        d, v, used = heapq.heappop(heap)
        if d > dist[v][used]:
            continue
        for w, c in graph[v]:
            relax(d + c, w, used)
            if used == 0:
                relax(d + c // 2, w, 1)
    best = min(dist[n - 1])
    return -1 if best == INF else best
