def solution(heights):
    def count(a):
        if len(a) <= 1:
            return a, 0
        mid = len(a) // 2
        left, x = count(a[:mid])
        right, y = count(a[mid:])
        merged = []
        swaps = x + y
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
                swaps += len(left) - i
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, swaps

    return count(heights)[1]
