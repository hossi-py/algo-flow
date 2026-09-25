def solution(n, roads):
    graph = [[] for _ in range(n)]
    for a, b in roads:
        graph[a].append(b)
        graph[b].append(a)
    dist = [0] * n

    def dfs(v, parent, d):
        dist[v] = d
        for w in graph[v]:
            if w != parent:
                dfs(w, v, d + 1)

    def farthest(s):
        dfs(s, -1, 0)
        best = max(range(n), key=lambda v: dist[v])
        return best, dist[best]

    a, _ = farthest(0)
    _, answer = farthest(a)
    return answer
