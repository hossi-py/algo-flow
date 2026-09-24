from collections import deque


def solution(commands):
    line = deque()
    answer = []
    for command in commands:
        parts = command.split()
        name = parts[0]
        if name == "enqueue":
            line.append(int(parts[1]))
        elif name == "dequeue":
            if line:
                line.popleft()
        elif name == "front":
            answer.append(line[0] if line else -1)
        else:
            answer.append(line[-1] if line else -1)
    return answer
