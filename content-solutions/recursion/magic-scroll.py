def solution(n, k):
    def letter(level, pos):
        if level == 1:
            return "a"
        half = 2 ** (level - 1) - 1
        if pos <= half:
            return letter(level - 1, pos)
        if pos == half + 1:
            return "b"
        c = letter(level - 1, pos - half - 1)
        return "b" if c == "a" else "a"

    return letter(n, k)
