from collections import deque


def solution(a, b, k):
    dist = [[-1] * (b + 1) for _ in range(a + 1)]
    dist[0][0] = 0
    queue = deque([(0, 0)])
    while queue:
        x, y = queue.popleft()
        if x == k or y == k:
            return dist[x][y]
        ab = min(x, b - y)
        ba = min(y, a - x)
        for nx, ny in ((a, y), (x, b), (0, y), (x, 0), (x - ab, y + ab), (x + ba, y - ba)):
            if dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1
                queue.append((nx, ny))
    return -1
