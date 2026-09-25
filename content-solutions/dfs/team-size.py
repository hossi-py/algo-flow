def solution(boss):
    n = len(boss)
    children = [[] for _ in range(n)]
    root = 0
    for i, b in enumerate(boss):
        if b == -1:
            root = i
        else:
            children[b].append(i)
    sizes = [0] * n

    def dfs(v):
        total = 1
        for w in children[v]:
            total += dfs(w)
        sizes[v] = total
        return total

    dfs(root)
    return sizes
