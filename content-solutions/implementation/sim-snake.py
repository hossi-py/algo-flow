from collections import deque


def solution(n, apples, times, dirs):
    dr = [0, 1, 0, -1]
    dc = [1, 0, -1, 0]
    apple = {(r, c) for r, c in apples}
    body = deque([(0, 0)])
    occupied = {(0, 0)}
    d = 0
    t = 0
    k = 0
    while True:
        t += 1
        nr, nc = body[0][0] + dr[d], body[0][1] + dc[d]
        if not (0 <= nr < n and 0 <= nc < n) or (nr, nc) in occupied:
            return t
        body.appendleft((nr, nc))
        occupied.add((nr, nc))
        if (nr, nc) in apple:
            apple.remove((nr, nc))
        else:
            occupied.remove(body.pop())
        if k < len(times) and times[k] == t:
            d = (d + 1) % 4 if dirs[k] == "D" else (d + 3) % 4
            k += 1
