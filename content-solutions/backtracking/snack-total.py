def solution(prices, money):
    n = len(prices)

    def go(i, total):
        if i == n:
            return 1 if total == money else 0
        return go(i + 1, total + prices[i]) + go(i + 1, total)

    return go(0, 0)
