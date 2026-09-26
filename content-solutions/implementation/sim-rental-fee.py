def solution(records, fees):
    base_time, base_fee, unit_time, unit_fee = fees
    start = {}
    total = {}
    for rec in records:
        t, num, kind = rec.split()
        h, m = map(int, t.split(":"))
        minute = h * 60 + m
        if kind == "OUT":
            start[num] = minute
            total.setdefault(num, 0)
        else:
            total[num] += minute - start.pop(num)
    for num, s in start.items():
        total[num] += 1439 - s
    answer = []
    for num in sorted(total):
        t = total[num]
        if t <= base_time:
            answer.append(base_fee)
        else:
            answer.append(base_fee + (t - base_time + unit_time - 1) // unit_time * unit_fee)
    return answer
