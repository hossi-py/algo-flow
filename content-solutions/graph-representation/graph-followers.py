def solution(n, follows):
    followers = [[] for _ in range(n)]
    for a, b in follows:
        followers[b].append(a)
    for f in followers:
        f.sort()
    return followers
