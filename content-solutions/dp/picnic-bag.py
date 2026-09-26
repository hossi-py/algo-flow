def solution(weights, values, limit):
    best = [0] * (limit + 1)
    for wt, v in zip(weights, values):
        for w in range(limit, wt - 1, -1):
            best[w] = max(best[w], best[w - wt] + v)
    return best[limit]
