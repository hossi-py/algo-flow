def solution(a, b):
    if b == 0:
        return a
    return solution(b, a % b)
