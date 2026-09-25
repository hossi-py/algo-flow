from collections import deque


def solution(doughs, limit):
    line = deque(doughs)
    answer = []
    while line:
        w = line.popleft()
        if w <= limit:
            answer.append(w)
        else:
            line.append(w // 2)
            line.append(w - w // 2)
    return answer
