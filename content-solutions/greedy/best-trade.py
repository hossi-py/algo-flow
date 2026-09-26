def solution(prices):
    lowest = float("inf")
    best = 0
    for p in prices:
        best = max(best, p - lowest)
        lowest = min(lowest, p)
    return best
