def solution(n, bridges, cuts):
    parent = list(range(n))
    size = [1] * n

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while x != root:
            nxt = parent[x]
            parent[x] = root
            x = nxt
        return root

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]
        return True

    cut = set(cuts)
    groups = n
    for i, (a, b) in enumerate(bridges):
        if i not in cut and union(a, b):
            groups -= 1
    answer = []
    for idx in reversed(cuts):
        answer.append(groups)
        a, b = bridges[idx]
        if union(a, b):
            groups -= 1
    return answer[::-1]
