def solution(n, rules):
    graph = [[] for _ in range(n)]
    for a, b in rules:
        graph[a].append(b)
    state = [0] * n

    def has_cycle(v):
        state[v] = 1
        for w in graph[v]:
            if state[w] == 1:
                return True
            if state[w] == 0 and has_cycle(w):
                return True
        state[v] = 2
        return False

    for v in range(n):
        if state[v] == 0 and has_cycle(v):
            return False
    return True
