def solution(invited, arrivals):
    invited_set = set(invited)
    answer = []
    for name in arrivals:
        answer.append(name in invited_set)
    return answer
