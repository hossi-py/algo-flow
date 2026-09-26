def solution(days):
    first = {0: -1}
    total = 0
    best = 0
    for i, d in enumerate(days):
        total += 1 if d == 1 else -1
        if total in first:
            best = max(best, i - first[total])
        else:
            first[total] = i
    return best
