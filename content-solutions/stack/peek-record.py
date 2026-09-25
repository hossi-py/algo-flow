def solution(commands):
    stack = []
    answer = []
    for command in commands:
        parts = command.split()
        if parts[0] == "push":
            stack.append(int(parts[1]))
        elif parts[0] == "pop":
            if stack:
                stack.pop()
        else:
            answer.append(stack[-1] if stack else -1)
    return answer
