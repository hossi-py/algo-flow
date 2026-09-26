import heapq


def solution(piles):
    h = piles[:]
    heapq.heapify(h)
    total = 0
    while len(h) >= 2:
        a = heapq.heappop(h)
        b = heapq.heappop(h)
        total += a + b
        heapq.heappush(h, a + b)
    return total
