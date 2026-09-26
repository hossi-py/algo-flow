from bisect import bisect_left


def solution(stations, homes):
    s = sorted(stations)
    answer = []
    for h in homes:
        i = bisect_left(s, h)
        best = float("inf")
        if i < len(s):
            best = s[i] - h
        if i > 0:
            best = min(best, h - s[i - 1])
        answer.append(best)
    return answer
