import heapq


def solution(nums, k):
    h = []
    result = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            result.append(heapq.heappop(h))
    while h:
        result.append(heapq.heappop(h))
    return result
