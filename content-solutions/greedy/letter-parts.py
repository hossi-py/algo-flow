def solution(s):
    last = {c: i for i, c in enumerate(s)}
    parts = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            parts.append(end - start + 1)
            start = i + 1
    return parts
