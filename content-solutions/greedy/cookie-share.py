def solution(greed, cookies):
    g = sorted(greed)
    i = 0
    for size in sorted(cookies):
        if i < len(g) and size >= g[i]:
            i += 1
    return i
