from bisect import bisect_left


def solution(stones):
    tails = []
    for x in stones:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
