def solution(coins, amount):
    INF = float("inf")
    fewest = [INF] * (amount + 1)
    fewest[0] = 0
    for c in coins:
        for a in range(c, amount + 1):
            fewest[a] = min(fewest[a], fewest[a - c] + 1)
    return -1 if fewest[amount] == INF else fewest[amount]
