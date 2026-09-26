def solution(n, bars):
    at = list(range(n))
    for row, col in sorted(bars):
        at[col], at[col + 1] = at[col + 1], at[col]
    answer = [0] * n
    for col in range(n):
        answer[at[col]] = col
    return answer
