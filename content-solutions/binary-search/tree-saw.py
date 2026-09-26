def solution(trees, m):
    lo, hi, answer = 0, max(trees), 0
    while lo <= hi:
        mid = (lo + hi) // 2
        got = sum(t - mid for t in trees if t > mid)
        if got >= m:
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return answer
