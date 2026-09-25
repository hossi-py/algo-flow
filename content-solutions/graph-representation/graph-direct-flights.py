def solution(n, flights, queries):
    table = [[False] * n for _ in range(n)]
    for a, b in flights:
        table[a][b] = True
    return [table[s][t] for s, t in queries]
