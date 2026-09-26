def solution(names, scores, times):
    order = sorted(range(len(names)), key=lambda i: (-scores[i], times[i], names[i]))
    return [names[i] for i in order]
