def solution(acorns, S):
    l = 0
    total = 0
    best = float("inf")
    for r, x in enumerate(acorns):
        total += x
        while total >= S:
            best = min(best, r - l + 1)
            total -= acorns[l]
            l += 1
    return 0 if best == float("inf") else best
