def solution(s):
    answer = [-1] * len(s)
    stack = []
    for i, ch in enumerate(s):
        if ch == "(":
            stack.append(i)
        elif ch == ")":
            j = stack.pop()
            answer[i] = j
            answer[j] = i
    return answer
