def solution(coins, amount):
    count = 0
    for coin in sorted(coins, reverse=True):
        count += amount // coin
        amount %= coin
    return count
