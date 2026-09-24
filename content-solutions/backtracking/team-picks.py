def solution(n, k):
    result = []
    path = []

    def pick(start):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            pick(i + 1)
            path.pop()

    pick(1)
    return result
