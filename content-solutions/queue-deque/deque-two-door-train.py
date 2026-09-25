from collections import deque


def solution(commands):
    train = deque()
    for command in commands:
        parts = command.split()
        name = parts[0]
        if name == "push_front":
            train.appendleft(int(parts[1]))
        elif name == "push_back":
            train.append(int(parts[1]))
        elif name == "pop_front":
            if train:
                train.popleft()
        elif train:
            train.pop()
    return list(train)
