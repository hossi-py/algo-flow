def solution(table):
    n = len(table)
    return [[j for j in range(n) if table[i][j] == 1] for i in range(n)]
