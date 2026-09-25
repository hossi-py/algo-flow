from collections import Counter


def solution(board, word):
    rows, cols = len(board), len(board[0])
    have = Counter(ch for row in board for ch in row)
    if any(have[ch] < cnt for ch, cnt in Counter(word).items()):
        return False
    used = [[False] * cols for _ in range(rows)]

    def search(r, c, k):
        if board[r][c] != word[k]:
            return False
        if k == len(word) - 1:
            return True
        used[r][c] = True
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not used[nr][nc] and search(nr, nc, k + 1):
                used[r][c] = False
                return True
        used[r][c] = False
        return False

    return any(search(r, c, 0) for r in range(rows) for c in range(cols))
