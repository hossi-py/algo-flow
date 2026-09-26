def solution(n):
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps
