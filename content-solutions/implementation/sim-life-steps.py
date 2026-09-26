def solution(grid, k):
    rows, cols = len(grid), len(grid[0])
    for _ in range(k):
        new = []
        for r in range(rows):
            row = []
            for c in range(cols):
                cnt = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "#":
                            cnt += 1
                alive = grid[r][c] == "#"
                row.append("#" if cnt == 3 or (alive and cnt == 2) else ".")
            new.append("".join(row))
        grid = new
    return grid
