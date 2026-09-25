from collections import deque


def solution(arrivals, buses, interval, capacity):
    answer = [-1] * len(arrivals)
    waiting = deque()
    nxt = 0
    for bus in range(1, buses + 1):
        time = bus * interval
        while nxt < len(arrivals) and arrivals[nxt] <= time:
            waiting.append(nxt)
            nxt += 1
        for _ in range(min(capacity, len(waiting))):
            answer[waiting.popleft()] = bus
    return answer
