def solution(keys):
    stack = []
    for key in keys:
        if key == "<":
            if stack:
                stack.pop()
        else:
            stack.append(key)
    return "".join(stack)
