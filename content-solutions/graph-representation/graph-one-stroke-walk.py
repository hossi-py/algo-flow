def solution(n, trails):
    degree = [0] * n
    for a, b in trails:
        degree[a] += 1
        degree[b] += 1
    odd = sum(1 for d in degree if d % 2 == 1)
    return odd == 0 or odd == 2
