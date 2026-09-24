def solution(link):
    n = len(link)
    visited = [False] * n

    def dfs(v):
        visited[v] = True
        size = 1
        for w in range(n):
            if link[v][w] == 1 and not visited[w]:
                size += dfs(w)
        return size

    groups = 0
    largest = 0
    for v in range(n):
        if not visited[v]:
            groups += 1
            largest = max(largest, dfs(v))
    return [groups, largest]
