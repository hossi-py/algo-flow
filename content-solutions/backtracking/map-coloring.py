def solution(n, borders, k):
    graph = [[] for _ in range(n)]
    for a, b in borders:
        graph[a].append(b)
        graph[b].append(a)
    color = [-1] * n

    def paint(v):
        if v == n:
            return 1
        count = 0
        for c in range(k):
            if any(color[w] == c for w in graph[v]):
                continue
            color[v] = c
            count += paint(v + 1)
            color[v] = -1
        return count

    return paint(0)
