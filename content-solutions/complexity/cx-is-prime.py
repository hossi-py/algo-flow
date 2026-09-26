def solution(n):
    if n < 2:
        return "NO"
    i = 2
    while i * i <= n:
        if n % i == 0:
            return "NO"
        i += 1
    return "YES"
