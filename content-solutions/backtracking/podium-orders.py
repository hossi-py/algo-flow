def solution(names, k):
    answer = []
    path = []
    used = [False] * len(names)

    def pick():
        if len(path) == k:
            answer.append(path[:])
            return
        for i, name in enumerate(names):
            if not used[i]:
                used[i] = True
                path.append(name)
                pick()
                path.pop()
                used[i] = False

    pick()
    return answer
