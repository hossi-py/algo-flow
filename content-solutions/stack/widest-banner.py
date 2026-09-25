def solution(heights):
    h = heights + [0]
    stack = []
    best = 0
    for i in range(len(h)):
        while stack and h[stack[-1]] >= h[i]:
            top = stack.pop()
            left = stack[-1] + 1 if stack else 0
            best = max(best, h[top] * (i - left))
        stack.append(i)
    return best
