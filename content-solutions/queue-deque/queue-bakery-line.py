from collections import deque


def solution(events):
    line = deque()
    served = []
    for event in events:
        parts = event.split()
        if parts[0] == "arrive":
            line.append(parts[1])
        elif line:
            served.append(line.popleft())
    return served
