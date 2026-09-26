def solution(scores, k, threshold):
    need = threshold * k
    window = sum(scores[:k])
    count = 1 if window >= need else 0
    for i in range(k, len(scores)):
        window += scores[i] - scores[i - k]
        if window >= need:
            count += 1
    return count
