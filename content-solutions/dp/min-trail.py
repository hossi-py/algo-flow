def solution(fatigue):
    INF = float("inf")
    rows, cols = len(fatigue), len(fatigue[0])
    best = [row[:] for row in fatigue]
    for r in range(rows):
        for c in range(cols):
            if r == 0 and c == 0:
                continue
            up = best[r - 1][c] if r > 0 else INF
            left = best[r][c - 1] if c > 0 else INF
            best[r][c] += min(up, left)
    return best[rows - 1][cols - 1]
