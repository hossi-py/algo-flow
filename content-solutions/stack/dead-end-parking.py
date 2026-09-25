def solution(commands):
    lane = []
    answer = []
    for command in commands:
        parts = command.split()
        if parts[0] == "in":
            lane.append(int(parts[1]))
        elif lane:
            answer.append(lane.pop())
    while lane:
        answer.append(lane.pop())
    return answer
