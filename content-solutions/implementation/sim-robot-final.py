def solution(commands):
    x = y = 0
    for ch in commands:
        if ch == "U":
            y += 1
        elif ch == "D":
            y -= 1
        elif ch == "L":
            x -= 1
        else:
            x += 1
    return [x, y]
