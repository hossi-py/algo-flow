def solution(garden):
    count = [0, 0]

    def compress(r, c, size):
        first = garden[r][c]
        if all(garden[y][x] == first for y in range(r, r + size) for x in range(c, c + size)):
            count[int(first)] += 1
            return
        half = size // 2
        compress(r, c, half)
        compress(r, c + half, half)
        compress(r + half, c, half)
        compress(r + half, c + half, half)

    compress(0, 0, len(garden))
    return count
