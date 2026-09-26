def solution(word, letter):
    i = 0
    for c in letter:
        if i < len(word) and c == word[i]:
            i += 1
    return i == len(word)
