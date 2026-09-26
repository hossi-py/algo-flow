def solution(shelf, queries):
    n = len(shelf)
    lo, hi = 0, n - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if shelf[mid] > shelf[n - 1]:
            lo = mid + 1
        else:
            hi = mid
    p = lo

    def find(x, lo, hi):
        while lo <= hi:
            mid = (lo + hi) // 2
            if shelf[mid] == x:
                return mid
            if shelf[mid] < x:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1

    return [find(x, p, n - 1) if x <= shelf[n - 1] else find(x, 0, p - 1) for x in queries]
