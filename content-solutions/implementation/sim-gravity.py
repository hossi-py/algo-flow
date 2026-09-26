def solution(grid):
    g = [list(row) for row in grid]
    n, m = len(g), len(g[0])
    for c in range(m):
        land = n - 1
        for r in range(n - 1, -1, -1):
            ch = g[r][c]
            if ch == "#":
                land = r - 1
            elif ch != ".":
                g[r][c] = "."
                g[land][c] = ch
                land -= 1
    return ["".join(row) for row in g]
