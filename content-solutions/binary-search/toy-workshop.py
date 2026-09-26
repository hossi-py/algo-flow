def solution(times, m):
    lo, hi = 1, min(times) * m
    answer = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        made = 0
        for t in times:
            made += mid // t
            if made >= m:
                break
        if made >= m:
            answer = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return answer
