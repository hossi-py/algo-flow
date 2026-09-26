def solution(jumps):
    count = 0
    end = 0
    far = 0
    for i in range(len(jumps) - 1):
        far = max(far, i + jumps[i])
        if i == end:
            count += 1
            end = far
    return count
