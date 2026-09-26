def solution(coins, amount):
    MOD = 1_000_000_007
    ways = [0] * (amount + 1)
    ways[0] = 1
    for c in coins:
        for a in range(c, amount + 1):
            ways[a] = (ways[a] + ways[a - c]) % MOD
    return ways[amount]
