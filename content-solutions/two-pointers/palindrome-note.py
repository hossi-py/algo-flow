def solution(note):
    l, r = 0, len(note) - 1
    while l < r:
        if not note[l].isalnum():
            l += 1
        elif not note[r].isalnum():
            r -= 1
        elif note[l].lower() != note[r].lower():
            return False
        else:
            l, r = l + 1, r - 1
    return True
