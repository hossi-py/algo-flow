def solution(acorns):
    prev2, prev1 = 0, 0
    for x in acorns:
        cur = max(prev1, prev2 + x)
        prev2, prev1 = prev1, cur
    return prev1
