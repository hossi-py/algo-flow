from collections import deque


def solution(scores, k):
    n = len(scores)
    best = [0] * n
    best[0] = scores[0]
    window = deque([0])
    for i in range(1, n):
        while window[0] < i - k:
            window.popleft()
        best[i] = scores[i] + best[window[0]]
        while window and best[window[-1]] <= best[i]:
            window.pop()
        window.append(i)
    return best[-1]
