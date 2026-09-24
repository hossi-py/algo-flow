def solution(n, pairs):
    graph = [[] for _ in range(n)]
    for a, b in pairs:
        graph[a].append(b)
        graph[b].append(a)
    for friends in graph:
        friends.sort()
    return graph
