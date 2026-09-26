def solution(n):
    lo, hi, answer = 0, n, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return answer
