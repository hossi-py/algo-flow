from bisect import bisect_left, bisect_right


def solution(heights, ranges):
    s = sorted(heights)
    return [bisect_right(s, r) - bisect_left(s, l) for l, r in ranges]
