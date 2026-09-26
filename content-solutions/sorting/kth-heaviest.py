def solution(weights, k):
    sorted_w = sorted(weights, reverse=True)
    return sorted_w[k - 1]
