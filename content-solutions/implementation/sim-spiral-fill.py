def solution(n, m):
    board = [[0] * m for _ in range(n)]
    dr = [0, 1, 0, -1]
    dc = [1, 0, -1, 0]
    r = c = d = 0
    for k in range(1, n * m + 1):
        board[r][c] = k
        nr, nc = r + dr[d], c + dc[d]
        if not (0 <= nr < n and 0 <= nc < m) or board[nr][nc] != 0:
            d = (d + 1) % 4
        r, c = r + dr[d], c + dc[d]
    return board
