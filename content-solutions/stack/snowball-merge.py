def solution(sizes):
    stack = []
    for ball in sizes:
        while stack and stack[-1] == ball:
            stack.pop()
            ball *= 2
        stack.append(ball)
    return stack
