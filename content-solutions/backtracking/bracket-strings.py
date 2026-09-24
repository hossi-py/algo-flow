def solution(n):
    result = []

    def make(s, open_, close):
        if len(s) == 2 * n:
            result.append(s)
            return
        if open_ < n:
            make(s + "(", open_ + 1, close)
        if close < open_:
            make(s + ")", open_, close + 1)

    make("", 0, 0)
    return result
