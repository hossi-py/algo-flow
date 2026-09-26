import heapq


def solution(k, w, profit, need):
    jobs = sorted(zip(need, profit))
    n = len(jobs)
    h = []
    i = 0
    for _ in range(k):
        while i < n and jobs[i][0] <= w:
            heapq.heappush(h, -jobs[i][1])
            i += 1
        if not h:
            break
        w += -heapq.heappop(h)
    return w
