def solution(prices, budget):
    seen = {}
    for j, x in enumerate(prices):
        need = budget - x
        if need in seen:
            return [seen[need], j]
        if x not in seen:
            seen[x] = j
    return []
