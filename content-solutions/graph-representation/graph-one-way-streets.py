def solution(n, roads):
    out = [0] * n
    inn = [0] * n
    for a, b in roads:
        out[a] += 1
        inn[b] += 1
    return [[out[i], inn[i]] for i in range(n)]
