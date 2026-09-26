def solution(prices, budget):
    count = 0
    for p in sorted(prices):
        if p > budget:
            break
        budget -= p
        count += 1
    return count
