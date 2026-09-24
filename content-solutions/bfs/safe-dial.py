from collections import deque


def solution(target, jammed):
    blocked = set(jammed)
    if "0000" in blocked:
        return -1
    dist = {"0000": 0}
    queue = deque(["0000"])
    while queue:
        s = queue.popleft()
        if s == target:
            return dist[s]
        for i in range(4):
            for d in (1, -1):
                digit = (int(s[i]) + d) % 10
                t = s[:i] + str(digit) + s[i + 1:]
                if t not in blocked and t not in dist:
                    dist[t] = dist[s] + 1
                    queue.append(t)
    return -1
