def solution(books, queries):
    def find(x):
        lo, hi = 0, len(books) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if books[mid] == x:
                return mid
            if books[mid] < x:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1

    return [find(q) for q in queries]
