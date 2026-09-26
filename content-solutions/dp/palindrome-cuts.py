def solution(ribbon):
    s = ribbon
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    cuts = [0] * n
    for j in range(n):
        cuts[j] = j
        for i in range(j + 1):
            if s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1]):
                pal[i][j] = True
                cuts[j] = 0 if i == 0 else min(cuts[j], cuts[i - 1] + 1)
    return cuts[n - 1]
