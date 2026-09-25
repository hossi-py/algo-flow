def solution(n, recs):
    inn = [0] * (n + 1)
    out = [0] * (n + 1)
    for a, b in recs:
        out[a] += 1
        inn[b] += 1
    for x in range(1, n + 1):
        if inn[x] == n - 1 and out[x] == 0:
            return x
    return -1
