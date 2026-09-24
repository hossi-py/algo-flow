def solution(n, pairs, u, v):
    graph = [[] for _ in range(n)]
    for a, b in pairs:
        graph[a].append(b)
        graph[b].append(a)
    friends_u = set(graph[u])
    return sorted(x for x in graph[v] if x in friends_u)
