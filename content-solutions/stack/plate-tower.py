def solution(commands):
    stack = []
    for command in commands:
        parts = command.split()
        if parts[0] == "push":
            stack.append(int(parts[1]))
        elif stack:
            stack.pop()
    return stack
