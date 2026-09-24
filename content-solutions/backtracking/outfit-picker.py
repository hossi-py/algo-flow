def solution(closet):
    result = []
    path = []

    def choose(i):
        if i == len(closet):
            result.append(path[:])
            return
        for item in closet[i]:
            path.append(item)
            choose(i + 1)
            path.pop()

    choose(0)
    return result
