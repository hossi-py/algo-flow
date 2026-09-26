import heapq


def solution(tasks):
    n = len(tasks)
    order = sorted(range(n), key=lambda j: tasks[j][0])
    h = []
    result = []
    i = 0
    time = 0
    while len(result) < n:
        while i < n and tasks[order[i]][0] <= time:
            j = order[i]
            heapq.heappush(h, (tasks[j][1], j))
            i += 1
        if not h:
            time = tasks[order[i]][0]
            continue
        d, j = heapq.heappop(h)
        result.append(j)
        time += d
    return result
