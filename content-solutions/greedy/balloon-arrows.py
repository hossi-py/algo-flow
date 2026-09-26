def solution(balloons):
    arrow = float("-inf")
    count = 0
    for l, r in sorted(balloons, key=lambda b: b[1]):
        if l > arrow:
            count += 1
            arrow = r
    return count
