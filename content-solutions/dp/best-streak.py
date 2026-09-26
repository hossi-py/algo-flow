def solution(profits):
    cur = best = profits[0]
    for x in profits[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
