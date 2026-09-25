from collections import deque


def solution(town):
    rows, cols = len(town), len(town[0])
    dist = [[-1] * cols for _ in range(rows)]
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if town[r][c] == "R":
                dist[r][c] = 0
                queue.append((r, c))
    while queue:
        r, c = queue.popleft()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and town[nr][nc] == "P" and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    days = 0
    for r in range(rows):
        for c in range(cols):
            if town[r][c] == "P":
                if dist[r][c] == -1:
                    return -1
                days = max(days, dist[r][c])
    return days
