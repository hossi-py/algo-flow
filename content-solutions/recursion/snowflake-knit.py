def solution(k):
    def pattern(level):
        if level == 0:
            return ["*"]
        small = pattern(level - 1)
        blank = " " * len(small)
        top = [row * 3 for row in small]
        mid = [row + blank + row for row in small]
        return top + mid + top

    return pattern(k)
