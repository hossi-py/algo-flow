def solution(shelf):
    last = {}
    left = 0
    best = 0
    for right, c in enumerate(shelf):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        best = max(best, right - left + 1)
    return best
