def solution(times):
    now = 0
    total = 0
    for t in sorted(times):
        now += t
        total += now
    return total
