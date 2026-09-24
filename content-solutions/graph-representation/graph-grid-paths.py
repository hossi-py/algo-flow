def solution(grid):
    rows, cols = len(grid), len(grid[0])
    result = []
    for r in range(rows):
        row = []
        for c in range(cols):
            if grid[r][c] == "#":
                row.append(-1)
                continue
            count = 0
            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == ".":
                    count += 1
            row.append(count)
        result.append(row)
    return result
