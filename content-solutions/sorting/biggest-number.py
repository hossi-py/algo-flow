from functools import cmp_to_key


def solution(cards):
    def compare(a, b):
        if a + b > b + a:
            return -1
        if a + b < b + a:
            return 1
        return 0

    s = sorted(map(str, cards), key=cmp_to_key(compare))
    r = "".join(s)
    return "0" if r[0] == "0" else r
