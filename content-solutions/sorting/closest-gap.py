def solution(positions):
    p = sorted(positions)
    return min(p[i] - p[i - 1] for i in range(1, len(p)))
