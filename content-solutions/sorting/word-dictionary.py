def solution(words):
    return sorted(set(words), key=lambda w: (len(w), w))
