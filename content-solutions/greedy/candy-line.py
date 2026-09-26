def solution(scores):
    n = len(scores)
    candy = [1] * n
    for i in range(1, n):
        if scores[i] > scores[i - 1]:
            candy[i] = candy[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if scores[i] > scores[i + 1]:
            candy[i] = max(candy[i], candy[i + 1] + 1)
    return sum(candy)
