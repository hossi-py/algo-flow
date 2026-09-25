from collections import deque


def solution(times):
    window = deque()
    answer = []
    for t in times:
        window.append(t)
        while window[0] < t - 3000:
            window.popleft()
        answer.append(len(window))
    return answer
