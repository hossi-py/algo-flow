def solution(commands):
    top, bottom, north, south, east, west = 1, 6, 2, 5, 3, 4
    total = 0
    for ch in commands:
        if ch == "E":
            top, east, bottom, west = west, top, east, bottom
        elif ch == "W":
            top, west, bottom, east = east, top, west, bottom
        elif ch == "N":
            top, north, bottom, south = south, top, north, bottom
        else:
            top, south, bottom, north = north, top, south, bottom
        total += top
    return total
