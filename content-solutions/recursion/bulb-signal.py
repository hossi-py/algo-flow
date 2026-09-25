def solution(n):
    def signal(k):
        if k < 2:
            return str(k)
        return signal(k // 2) + str(k % 2)

    return signal(n)
