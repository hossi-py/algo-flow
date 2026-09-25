from collections import deque


def solution(n):
    cards = deque(range(1, n + 1))
    while len(cards) > 1:
        cards.popleft()
        cards.append(cards.popleft())
    return cards[0]
