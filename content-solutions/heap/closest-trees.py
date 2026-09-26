import heapq


def solution(trees, k):
    h = [(x * x + y * y, x, y) for x, y in trees]
    heapq.heapify(h)
    result = []
    for _ in range(k):
        _, x, y = heapq.heappop(h)
        result.append([x, y])
    return result
