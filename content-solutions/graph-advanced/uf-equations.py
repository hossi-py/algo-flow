def solution(equations):
    n = 26
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

    def idx(ch):
        return ord(ch) - ord("a")

    for e in equations:
        if e[1] == "=":
            union(idx(e[0]), idx(e[3]))
    for e in equations:
        if e[1] == "!" and find(idx(e[0])) == find(idx(e[3])):
            return "NO"
    return "YES"
