def solution(n, stickers):
    have = set(stickers)
    answer = []
    for k in range(1, n + 1):
        if k not in have:
            answer.append(k)
    return answer
