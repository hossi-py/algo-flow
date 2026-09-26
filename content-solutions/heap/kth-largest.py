import heapq


def solution(scores, k):
    h = []
    for s in scores:
        heapq.heappush(h, s)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]
