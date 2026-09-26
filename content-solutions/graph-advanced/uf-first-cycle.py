def solution(n, bridges):
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

    for i, (a, b) in enumerate(bridges, 1):
        if find(a) == find(b):
            return i
        union(a, b)
    return 0
