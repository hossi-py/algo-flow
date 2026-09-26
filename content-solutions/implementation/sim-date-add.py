def solution(date, days):
    def is_leap(y):
        return (y % 4 == 0 and y % 100 != 0) or y % 400 == 0

    def month_days(y, m):
        if m == 2:
            return 29 if is_leap(y) else 28
        return 30 if m in (4, 6, 9, 11) else 31

    y, m, d = map(int, date.split("-"))
    day = d - 1 + sum(month_days(y, k) for k in range(1, m)) + days
    while day >= (366 if is_leap(y) else 365):
        day -= 366 if is_leap(y) else 365
        y += 1
    m = 1
    while day >= month_days(y, m):
        day -= month_days(y, m)
        m += 1
    return f"{y:04d}-{m:02d}-{day + 1:02d}"
