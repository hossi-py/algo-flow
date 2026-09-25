def solution(values, target):
    values = sorted(values)
    answer = []
    path = []

    def pick(start, remain):
        if remain == 0:
            answer.append(path[:])
            return
        for i in range(start, len(values)):
            if values[i] > remain:
                break
            path.append(values[i])
            pick(i, remain - values[i])
            path.pop()

    pick(0, target)
    return answer
