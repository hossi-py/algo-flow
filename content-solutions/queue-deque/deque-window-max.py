from collections import deque


def solution(temps, k):
    window = deque()
    answer = []
    for i, t in enumerate(temps):
        while window and temps[window[-1]] <= t:
            window.pop()
        window.append(i)
        if window[0] <= i - k:
            window.popleft()
        if i >= k - 1:
            answer.append(temps[window[0]])
    return answer
