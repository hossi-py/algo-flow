def solution(prices, target):
    l, r = 0, len(prices) - 1
    while l < r:
        s = prices[l] + prices[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1
        else:
            r -= 1
    return []
