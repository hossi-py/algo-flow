def solution(neighbors):
    total = 0
    for islands in neighbors:
        total += len(islands)
    return total // 2
