def solution(weights, limit):
    w = sorted(weights)
    i, j = 0, len(w) - 1
    rafts = 0
    while i <= j:
        if w[i] + w[j] <= limit:
            i += 1
        j -= 1
        rafts += 1
    return rafts
