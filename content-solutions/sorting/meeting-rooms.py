def solution(meetings):
    events = []
    for s, e in meetings:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()
    now = best = 0
    for t, d in events:
        now += d
        best = max(best, now)
    return best
