def solution(pattern, words):
    if len(pattern) != len(words):
        return False
    to_word = {}
    to_char = {}
    for c, w in zip(pattern, words):
        if c in to_word and to_word[c] != w:
            return False
        if w in to_char and to_char[w] != c:
            return False
        to_word[c] = w
        to_char[w] = c
    return True
