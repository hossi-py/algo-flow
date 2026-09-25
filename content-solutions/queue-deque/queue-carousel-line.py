from collections import deque


def solution(commands):
    line = deque()
    answer = []
    for command in commands:
        name, value = command.split()
        if name == "arrive":
            line.append(value)
        else:
            group = []
            for _ in range(min(int(value), len(line))):
                group.append(line.popleft())
            answer.append(group)
    return answer
