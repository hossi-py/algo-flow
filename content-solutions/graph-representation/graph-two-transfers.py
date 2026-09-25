def solution(routes):
    n = len(routes)
    answer = [[0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            if routes[i][k]:
                row = routes[k]
                for j in range(n):
                    if row[j]:
                        answer[i][j] = 1
    return answer
