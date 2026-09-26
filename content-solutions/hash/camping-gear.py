def solution(kinds):
    count = {}
    for kind in kinds:
        count[kind] = count.get(kind, 0) + 1
    ways = 1
    for c in count.values():
        ways *= c + 1
    return ways - 1
