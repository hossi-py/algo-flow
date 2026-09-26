def solution(vines, k):
    lo, hi, answer = 1, max(vines), 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if sum(v // mid for v in vines) >= k:
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return answer
