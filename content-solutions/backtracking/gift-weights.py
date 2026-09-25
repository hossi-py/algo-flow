def solution(weights, limit):
    weights = sorted(weights)
    n = len(weights)

    def go(start, total):
        count = 0
        for i in range(start, n):
            w = total + weights[i]
            if w > limit:
                break
            if w == limit:
                count += 1
            else:
                count += go(i + 1, w)
        return count

    return go(0, 0)
