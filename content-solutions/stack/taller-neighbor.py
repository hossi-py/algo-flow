def solution(heights):
    answer = [0] * len(heights)
    stack = []
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] <= h:
            stack.pop()
        answer[i] = stack[-1] + 1 if stack else 0
        stack.append(i)
    return answer
