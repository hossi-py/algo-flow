def solution(pyramid):
    best = pyramid[-1][:]
    for r in range(len(pyramid) - 2, -1, -1):
        for c in range(r + 1):
            best[c] = pyramid[r][c] + max(best[c], best[c + 1])
    return best[0]
