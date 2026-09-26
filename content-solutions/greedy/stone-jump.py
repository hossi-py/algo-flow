def solution(jumps):
    far = 0
    for i, j in enumerate(jumps):
        if i > far:
            return False
        far = max(far, i + j)
    return True
