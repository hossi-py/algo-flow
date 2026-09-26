def solution(rows, cols, positions):
    n = rows * cols
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

    land = [[False] * cols for _ in range(rows)]
    count = 0
    answer = []
    for r, c in positions:
        if not land[r][c]:
            land[r][c] = True
            count += 1
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols and land[nr][nc]:
                    if union(r * cols + c, nr * cols + nc):
                        count -= 1
        answer.append(count)
    return answer
