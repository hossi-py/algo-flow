def solution(number, k):
    stack = []
    for d in number:
        while k > 0 and stack and stack[-1] < d:
            stack.pop()
            k -= 1
        stack.append(d)
    if k:
        stack = stack[:-k]
    return "".join(stack)
