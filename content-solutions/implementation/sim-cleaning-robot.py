def solution(room, r, c, d):
    rows, cols = len(room), len(room[0])
    dr = [-1, 0, 1, 0]
    dc = [0, 1, 0, -1]
    cleaned = [[False] * cols for _ in range(rows)]
    count = 0
    while True:
        if not cleaned[r][c]:
            cleaned[r][c] = True
            count += 1
        dirty = any(room[r + dr[k]][c + dc[k]] == "." and not cleaned[r + dr[k]][c + dc[k]] for k in range(4))
        if not dirty:
            br, bc = r - dr[d], c - dc[d]
            if room[br][bc] == "#":
                break
            r, c = br, bc
        else:
            d = (d + 3) % 4
            fr, fc = r + dr[d], c + dc[d]
            if room[fr][fc] == "." and not cleaned[fr][fc]:
                r, c = fr, fc
    return count
