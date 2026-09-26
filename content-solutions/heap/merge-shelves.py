import heapq


def solution(shelves):
    h = [(shelf[0], i, 0) for i, shelf in enumerate(shelves) if shelf]
    heapq.heapify(h)
    result = []
    while h:
        v, i, j = heapq.heappop(h)
        result.append(v)
        if j + 1 < len(shelves[i]):
            heapq.heappush(h, (shelves[i][j + 1], i, j + 1))
    return result
