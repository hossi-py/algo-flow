def solution(departed, returned):
    count = {}
    for name in departed:
        count[name] = count.get(name, 0) + 1
    for name in returned:
        count[name] -= 1
    for name, c in count.items():
        if c > 0:
            return name
    return ""
