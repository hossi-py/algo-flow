def solution(garden):
    grid = [list(row) for row in garden]
    blanks = [(r, c) for r in range(6) for c in range(6) if grid[r][c] == "."]

    def fits(r, c, flower):
        for i in range(6):
            if grid[r][i] == flower or grid[i][c] == flower:
                return False
        top, left = r // 2 * 2, c // 3 * 3
        for i in range(top, top + 2):
            for j in range(left, left + 3):
                if grid[i][j] == flower:
                    return False
        return True

    def fill(k):
        if k == len(blanks):
            return True
        r, c = blanks[k]
        for flower in "123456":
            if fits(r, c, flower):
                grid[r][c] = flower
                if fill(k + 1):
                    return True
                grid[r][c] = "."
        return False

    fill(0)
    return ["".join(row) for row in grid]
