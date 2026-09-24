from collections import deque


def solution(dishes, q):
    line = deque((name, time) for name, time in dishes)
    done = []
    while line:
        name, left = line.popleft()
        left -= q
        if left <= 0:
            done.append(name)
        else:
            line.append((name, left))
    return done
