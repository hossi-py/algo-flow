from collections import deque

JUMPS = ((1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2))


def solution(field):
    rows, cols = len(field), len(field[0])
    dist = [[-1] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if field[r][c] == "S":
                start = (r, c)
    dist[start[0]][start[1]] = 0
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        if field[r][c] == "E":
            return dist[r][c]
        for dr, dc in JUMPS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and field[nr][nc] != "#" and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    return -1
