from collections import deque


def solution(maze):
    rows, cols = len(maze), len(maze[0])
    dist = [[-1] * cols for _ in range(rows)]
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == "S":
                dist[r][c] = 0
                queue.append((r, c))
    while queue:
        r, c = queue.popleft()
        if maze[r][c] == "E":
            return dist[r][c]
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    return -1
