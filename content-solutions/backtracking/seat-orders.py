def solution(names):
    n = len(names)
    used = [False] * n
    path = []
    result = []

    def place():
        if len(path) == n:
            result.append(path[:])
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                path.append(names[i])
                place()
                path.pop()
                used[i] = False

    place()
    return result
