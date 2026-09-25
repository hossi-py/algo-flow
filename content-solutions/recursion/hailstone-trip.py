def solution(n):
    if n == 1:
        return 0
    nxt = n // 2 if n % 2 == 0 else 3 * n + 1
    return 1 + solution(nxt)
