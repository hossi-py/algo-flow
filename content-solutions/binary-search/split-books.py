def solution(pages, k):
    def people(x):
        count, cur = 1, 0
        for p in pages:
            if cur + p > x:
                count += 1
                cur = 0
            cur += p
        return count

    lo, hi = max(pages), sum(pages)
    answer = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if people(mid) <= k:
            answer = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return answer
