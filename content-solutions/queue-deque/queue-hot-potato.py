from collections import deque


def solution(n, k):
    circle = deque(range(1, n + 1))
    out = []
    while circle:
        for _ in range(k - 1):
            circle.append(circle.popleft())
        out.append(circle.popleft())
    return out
