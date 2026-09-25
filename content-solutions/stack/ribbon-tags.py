def solution(tags):
    stack = []
    for tag in tags:
        closing = tag[1] == "/"
        name = tag[2:-1] if closing else tag[1:-1]
        if closing:
            if not stack or stack.pop() != name:
                return False
        else:
            stack.append(name)
    return not stack
