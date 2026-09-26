def solution(heights, k):
    count = {}
    answer = 0
    for x in heights:
        if k == 0:
            answer += count.get(x, 0)
        else:
            answer += count.get(x - k, 0) + count.get(x + k, 0)
        count[x] = count.get(x, 0) + 1
    return answer
