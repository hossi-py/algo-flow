import heapq


def solution(grid, k):
    n = len(grid)
    h = [(grid[r][0], r, 0) for r in range(n)]
    heapq.heapify(h)
    v = 0
    for _ in range(k):
        v, r, c = heapq.heappop(h)
        if c + 1 < n:
            heapq.heappush(h, (grid[r][c + 1], r, c + 1))
    return v
