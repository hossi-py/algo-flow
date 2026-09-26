def solution(time, minutes):
    h, m = map(int, time.split(":"))
    total = (h * 60 + m + minutes) % 1440
    return f"{total // 60:02d}:{total % 60:02d}"
