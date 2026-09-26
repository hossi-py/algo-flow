def solution(scores, queries):
    s = sorted(scores)
    n = len(s)

    def lower_bound(q):
        lo, hi = 0, n
        while lo < hi:
            mid = (lo + hi) // 2
            if s[mid] >= q:
                hi = mid
            else:
                lo = mid + 1
        return lo

    return [n - lower_bound(q) for q in queries]
