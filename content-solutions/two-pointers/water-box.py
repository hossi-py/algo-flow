def solution(walls):
    l, r = 0, len(walls) - 1
    best = 0
    while l < r:
        best = max(best, min(walls[l], walls[r]) * (r - l))
        if walls[l] < walls[r]:
            l += 1
        else:
            r -= 1
    return best
