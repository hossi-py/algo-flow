import heapq


def solution(stones):
    h = [-s for s in stones]
    heapq.heapify(h)
    while len(h) >= 2:
        a = -heapq.heappop(h)
        b = -heapq.heappop(h)
        if a != b:
            heapq.heappush(h, -(a - b))
    return -h[0] if h else 0
