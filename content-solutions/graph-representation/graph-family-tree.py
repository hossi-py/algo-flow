def solution(parent):
    children = [[] for _ in range(len(parent))]
    for i, p in enumerate(parent):
        if p != -1:
            children[p].append(i)
    return children
