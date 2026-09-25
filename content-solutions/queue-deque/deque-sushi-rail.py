from collections import deque


def solution(n, picks):
    rail = deque(range(1, n + 1))
    total = 0
    for p in picks:
        idx = rail.index(p)
        if idx <= len(rail) - idx:
            for _ in range(idx):
                rail.append(rail.popleft())
            total += idx
        else:
            for _ in range(len(rail) - idx):
                rail.appendleft(rail.pop())
            total += len(rail) - idx
        rail.popleft()
    return total
