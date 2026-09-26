def solution(stamps):
    result = [stamps[0]]
    for x in stamps[1:]:
        if x != result[-1]:
            result.append(x)
    return result
