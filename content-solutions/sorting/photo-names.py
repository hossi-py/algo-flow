def solution(files):
    def key(name):
        k = 0
        while not name[k].isdigit():
            k += 1
        return (name[:k].lower(), int(name[k:]))

    return sorted(files, key=key)
