def solution(matrix, k):
    a = matrix
    for _ in range(k % 4):
        n, m = len(a), len(a[0])
        b = [[0] * n for _ in range(m)]
        for r in range(n):
            for c in range(m):
                b[c][n - 1 - r] = a[r][c]
        a = b
    return a
