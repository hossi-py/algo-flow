import heapq


def solution(heights):
    low = []
    high = []
    result = []
    for x in heights:
        heapq.heappush(low, -x)
        heapq.heappush(high, -heapq.heappop(low))
        if len(high) > len(low):
            heapq.heappush(low, -heapq.heappop(high))
        result.append(-low[0])
    return result
