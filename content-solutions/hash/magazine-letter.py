def solution(letters, message):
    have = {}
    for ch in letters:
        have[ch] = have.get(ch, 0) + 1
    for ch in message:
        if have.get(ch, 0) == 0:
            return False
        have[ch] -= 1
    return True
