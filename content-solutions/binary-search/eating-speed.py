def solution(piles, hours):
    lo, hi = 1, max(piles)
    answer = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        need = sum((p + mid - 1) // mid for p in piles)
        if need <= hours:
            answer = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return answer
