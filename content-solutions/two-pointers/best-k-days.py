def solution(profits, k):
    window = sum(profits[:k])
    best = window
    for i in range(k, len(profits)):
        window += profits[i] - profits[i - k]
        best = max(best, window)
    return best
