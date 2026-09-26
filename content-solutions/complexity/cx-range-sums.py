def solution(queries):
    return [(a + b) * (b - a + 1) // 2 for a, b in queries]
