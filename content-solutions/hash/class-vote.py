def solution(votes):
    count = {}
    for v in votes:
        count[v] = count.get(v, 0) + 1
    best = None
    for name, c in count.items():
        if best is None or c > count[best] or (c == count[best] and name < best):
            best = name
    return best
