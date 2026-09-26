def solution(hooks, c):
    h = sorted(hooks)

    def count(d):
        placed, last = 1, h[0]
        for x in h[1:]:
            if x - last >= d:
                placed += 1
                last = x
        return placed

    lo, hi, answer = 1, h[-1] - h[0], 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if count(mid) >= c:
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return answer
