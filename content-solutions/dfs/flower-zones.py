DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))


def solution(garden):
    n, m = len(garden), len(garden[0])
    visited = [[False] * m for _ in range(n)]

    def dfs(r, c):
        visited[r][c] = True
        size = 1
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and garden[nr][nc] == '1' and not visited[nr][nc]:
                size += dfs(nr, nc)
        return size

    sizes = []
    for r in range(n):
        for c in range(m):
            if garden[r][c] == '1' and not visited[r][c]:
                sizes.append(dfs(r, c))

    return sorted(sizes)
