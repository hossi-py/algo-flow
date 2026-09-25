def solution(commands):
    stack = []
    mins = []
    answer = []
    for command in commands:
        parts = command.split()
        if parts[0] == "push":
            w = int(parts[1])
            stack.append(w)
            mins.append(w if not mins else min(w, mins[-1]))
        elif parts[0] == "pop":
            if stack:
                stack.pop()
                mins.pop()
        else:
            answer.append(mins[-1] if mins else -1)
    return answer
