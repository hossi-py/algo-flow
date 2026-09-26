def solution(commands):
    dx = [0, 1, 0, -1]
    dy = [1, 0, -1, 0]
    x = y = d = 0
    for ch in commands:
        if ch == "L":
            d = (d + 3) % 4
        elif ch == "R":
            d = (d + 1) % 4
        else:
            x += dx[d]
            y += dy[d]
    return [x, y]
