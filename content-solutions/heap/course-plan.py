import heapq


def solution(courses):
    h = []
    time = 0
    for d, last in sorted(courses, key=lambda c: c[1]):
        heapq.heappush(h, -d)
        time += d
        if time > last:
            time -= -heapq.heappop(h)
    return len(h)
