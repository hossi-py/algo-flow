def solution(heights):
    order = list(range(len(heights)))
    order.sort(key=lambda i: (heights[i], i))
    return order
