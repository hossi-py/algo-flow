from collections import deque


def solution(leap):
    n = len(leap)
    dist = [-1] * n
    dist[0] = 0
    queue = deque([0])
    while queue:
        i = queue.popleft()
        for j in (i + leap[i], i - leap[i]):
            if 0 <= j < n and dist[j] == -1:
                dist[j] = dist[i] + 1
                queue.append(j)
    return dist[n - 1]
