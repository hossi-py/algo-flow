def solution(temps):
    answer = [0] * len(temps)
    stack = []
    for today, temp in enumerate(temps):
        while stack and temps[stack[-1]] < temp:
            day = stack.pop()
            answer[day] = today - day
        stack.append(today)
    return answer
