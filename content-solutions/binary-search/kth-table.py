def solution(n, k):
    def count(x):
        total = 0
        for i in range(1, n + 1):
            total += min(n, x // i)
        return total

    lo, hi = 1, n * n
    answer = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if count(mid) >= k:
            answer = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return answer
