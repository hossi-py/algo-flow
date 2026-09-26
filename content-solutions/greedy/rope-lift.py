def solution(ropes):
    r = sorted(ropes, reverse=True)
    best = 0
    for k in range(1, len(r) + 1):
        best = max(best, r[k - 1] * k)
    return best
