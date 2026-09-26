def solution(prices):
    best = 0
    low = prices[0]
    for p in prices:
        best = max(best, p - low)
        low = min(low, p)
    return best
