def solution(forest):
    rows, cols = len(forest), len(forest[0])
    seen = [[False] * cols for _ in range(rows)]

    def fill(r, c):
        seen[r][c] = True
        touches = r == 0 or r == rows - 1 or c == 0 or c == cols - 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and forest[nr][nc] == "." and not seen[nr][nc]:
                if fill(nr, nc):
                    touches = True
        return touches

    lakes = 0
    for r in range(rows):
        for c in range(cols):
            if forest[r][c] == "." and not seen[r][c]:
                if not fill(r, c):
                    lakes += 1
    return lakes
