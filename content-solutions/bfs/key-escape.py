from collections import deque


def solution(room):
    rows, cols = len(room), len(room[0])
    visited = [[[False] * cols for _ in range(rows)] for _ in range(2)]
    for r in range(rows):
        for c in range(cols):
            if room[r][c] == "S":
                sr, sc = r, c
    visited[0][sr][sc] = True
    queue = deque([(sr, sc, 0, 0)])
    while queue:
        r, c, key, d = queue.popleft()
        if room[r][c] == "E":
            return d
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if not (0 <= nr < rows and 0 <= nc < cols) or room[nr][nc] == "#":
                continue
            if room[nr][nc] == "D" and not key:
                continue
            nkey = 1 if key or room[nr][nc] == "K" else 0
            if not visited[nkey][nr][nc]:
                visited[nkey][nr][nc] = True
                queue.append((nr, nc, nkey, d + 1))
    return -1
