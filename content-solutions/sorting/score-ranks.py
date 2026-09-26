def solution(scores):
    count = [0] * 101
    for s in scores:
        count[s] += 1
    higher = [0] * 101
    for v in range(99, -1, -1):
        higher[v] = higher[v + 1] + count[v + 1]
    return [higher[s] + 1 for s in scores]
