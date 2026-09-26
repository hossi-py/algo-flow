def solution(meetings):
    last_end = float("-inf")
    count = 0
    for s, e in sorted(meetings, key=lambda m: (m[1], m[0])):
        if s >= last_end:
            count += 1
            last_end = e
    return count
