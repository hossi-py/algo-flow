from collections import deque


def solution(boss):
    n = len(boss)
    children = [[] for _ in range(n)]
    root = 0
    for i, b in enumerate(boss):
        if b == -1:
            root = i
        else:
            children[b].append(i)
    level = [0] * n
    queue = deque([root])
    while queue:
        u = queue.popleft()
        for c in children[u]:
            level[c] = level[u] + 1
            queue.append(c)
    return level
