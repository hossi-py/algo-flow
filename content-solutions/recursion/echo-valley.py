def solution(n):
    answer = []

    def echo(k):
        if k == 0:
            return
        answer.append(k)
        echo(k - 1)
        answer.append(k)

    echo(n)
    return answer
