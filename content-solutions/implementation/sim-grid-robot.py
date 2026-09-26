def solution(grid, commands):
    rows, cols = len(grid), len(grid[0])
    dr = [-1, 0, 1, 0]
    dc = [0, 1, 0, -1]
    r = c = 0
    for i, row in enumerate(grid):
        if "S" in row:
            r, c = i, row.index("S")
    d = 0
    for ch in commands:
        if ch == "L":
            d = (d + 3) % 4
        elif ch == "R":
            d = (d + 1) % 4
        else:
            nr, nc = r + dr[d], c + dc[d]
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != "#":
                r, c = nr, nc
    return [r, c]
