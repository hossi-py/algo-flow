def solution(trees, k):
    l = 0
    count = {}
    best = 0
    for r, c in enumerate(trees):
        count[c] = count.get(c, 0) + 1
        while len(count) > k:
            left = trees[l]
            count[left] -= 1
            if count[left] == 0:
                del count[left]
            l += 1
        best = max(best, r - l + 1)
    return best
