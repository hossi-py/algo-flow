def solution(street, recipe):
    need = {}
    for c in recipe:
        need[c] = need.get(c, 0) + 1
    missing = len(recipe)
    l = 0
    best = float("inf")
    for r, c in enumerate(street):
        if need.get(c, 0) > 0:
            missing -= 1
        need[c] = need.get(c, 0) - 1
        while missing == 0:
            best = min(best, r - l + 1)
            left = street[l]
            need[left] += 1
            if need[left] > 0:
                missing += 1
            l += 1
    return 0 if best == float("inf") else best
