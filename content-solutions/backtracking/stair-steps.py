def solution(n):
    answer = []
    path = []

    def climb(remain):
        if remain == 0:
            answer.append(path[:])
            return
        for step in (1, 2):
            if step <= remain:
                path.append(step)
                climb(remain - step)
                path.pop()

    climb(n)
    return answer
