def solution(cost):
    best = cost[:]
    for i in range(2, len(cost)):
        best[i] = min(best[i - 1], best[i - 2]) + cost[i]
    return min(best[-1], best[-2])
