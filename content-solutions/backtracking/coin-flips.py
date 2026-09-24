def solution(n):
    result = []
    path = []

    def pick():
        if len(path) == n:
            result.append("".join(path))
            return
        for face in "HT":
            path.append(face)
            pick()
            path.pop()

    pick()
    return result
