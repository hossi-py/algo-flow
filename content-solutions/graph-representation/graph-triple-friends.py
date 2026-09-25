def solution(n, pairs):
    friends = [set() for _ in range(n)]
    for a, b in pairs:
        friends[a].add(b)
        friends[b].add(a)
    count = 0
    for a, b in pairs:
        count += len(friends[a] & friends[b])
    return count // 3
