import heapq


def solution(grid):
    rows, cols = len(grid), len(grid[0])
    broken = [[float("inf")] * cols for _ in range(rows)]
    broken[0][0] = 0
    heap = [(0, 0, 0)]
    while heap:
        b, r, c = heapq.heappop(heap)
        if r == rows - 1 and c == cols - 1:
            return b
        if b > broken[r][c]:
            continue
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                nb = b + (1 if grid[nr][nc] == "1" else 0)
                if nb < broken[nr][nc]:
                    broken[nr][nc] = nb
                    heapq.heappush(heap, (nb, nr, nc))
    return -1
