def solution(code):
    pair = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in code:
        if c in "([{":
            stack.append(c)
        elif not stack or stack.pop() != pair[c]:
            return False
    return not stack
