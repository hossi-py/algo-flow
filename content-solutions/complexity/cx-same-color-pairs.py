def solution(colors):
    count = [0] * 100
    for c in colors:
        count[c] += 1
    return sum(c * (c - 1) // 2 for c in count)
