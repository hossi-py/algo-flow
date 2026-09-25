def solution(balloons):
    stack = []
    for c in balloons:
        if stack and stack[-1] == c:
            stack.pop()
        else:
            stack.append(c)
    return "".join(stack)
