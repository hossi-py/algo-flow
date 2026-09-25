def solution(maze):
    rows, cols = len(maze), len(maze[0])
    visited = [[False] * cols for _ in range(rows)]

    def dfs(r, c):
        visited[r][c] = True
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and not visited[nr][nc]:
                dfs(nr, nc)

    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == "S":
                dfs(r, c)
    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == "E":
                return visited[r][c]
    return False
