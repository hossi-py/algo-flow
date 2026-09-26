def solution(text, word):
    m = len(word)
    need = [0] * 26
    for c in word:
        need[ord(c) - 97] += 1
    have = [0] * 26
    result = []
    for i, c in enumerate(text):
        have[ord(c) - 97] += 1
        if i >= m:
            have[ord(text[i - m]) - 97] -= 1
        if i >= m - 1 and have == need:
            result.append(i - m + 1)
    return result
