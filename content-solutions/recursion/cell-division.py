def solution(a, b, m):
    def power(e):
        if e == 0:
            return 1 % m
        half = power(e // 2)
        result = half * half % m
        if e % 2 == 1:
            result = result * a % m
        return result

    return power(b)
