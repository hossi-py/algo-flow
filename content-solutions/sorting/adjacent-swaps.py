def solution(heights):
    a = heights[:]
    swaps = 0
    for i in range(1, len(a)):
        j = i
        while j > 0 and a[j - 1] > a[j]:
            a[j - 1], a[j] = a[j], a[j - 1]
            swaps += 1
            j -= 1
    return swaps
