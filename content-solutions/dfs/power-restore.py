def solution(n, wires, plant):
    graph = [[] for _ in range(n)]
    for a, b in wires:
        graph[a].append(b)
        graph[b].append(a)
    visited = [False] * n

    def dfs(v):
        visited[v] = True
        count = 1
        for w in graph[v]:
            if not visited[w]:
                count += dfs(w)
        return count

    return dfs(plant)
