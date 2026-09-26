def solution(n, secret):
    lo, hi, count = 1, n, 0
    while True:
        mid = (lo + hi) // 2
        count += 1
        if mid == secret:
            return count
        if mid < secret:
            lo = mid + 1
        else:
            hi = mid - 1
