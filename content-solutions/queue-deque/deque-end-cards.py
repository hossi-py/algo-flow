from collections import deque


def solution(cards):
    row = deque(cards)
    score = [0, 0]
    turn = 0
    while row:
        if row[0] >= row[-1]:
            card = row.popleft()
        else:
            card = row.pop()
        score[turn % 2] += card
        turn += 1
    return score
