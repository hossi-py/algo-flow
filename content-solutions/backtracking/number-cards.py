def solution(cards, k):
    n = len(cards)
    used = [False] * n
    path = []
    made = set()

    def arrange():
        if len(path) == k:
            if path[0] != 0:
                made.add("".join(map(str, path)))
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                path.append(cards[i])
                arrange()
                path.pop()
                used[i] = False

    arrange()
    return len(made)
