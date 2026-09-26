import heapq


def solution(weights, k):
    h = weights[:]
    heapq.heapify(h)
    return [heapq.heappop(h) for _ in range(k)]
