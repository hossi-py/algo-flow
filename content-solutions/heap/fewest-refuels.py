import heapq


def solution(goal, start, springs):
    fuel = start
    stops = 0
    h = []
    for pos, water in springs + [[goal, 0]]:
        while fuel < pos:
            if not h:
                return -1
            fuel += -heapq.heappop(h)
            stops += 1
        heapq.heappush(h, -water)
    return stops
