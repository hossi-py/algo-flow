def solution(n, edges, x):
    result = []
    for a, b in edges:
        if a == x:
            result.append(b)
        elif b == x:
            result.append(a)
    return sorted(result)
