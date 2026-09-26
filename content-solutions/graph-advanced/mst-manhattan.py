def solution(points):
    n = len(points)
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

    edges = []
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i + 1, n):
            x2, y2 = points[j]
            edges.append((abs(x1 - x2) + abs(y1 - y2), i, j))
    edges.sort()
    total = 0
    picked = 0
    for d, i, j in edges:
        if union(i, j):
            total += d
            picked += 1
            if picked == n - 1:
                break
    return total
