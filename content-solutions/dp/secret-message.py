def solution(code):
    MOD = 1_000_000_007
    n = len(code)
    ways = [0] * (n + 1)
    ways[0] = 1
    for i in range(1, n + 1):
        if code[i - 1] != "0":
            ways[i] += ways[i - 1]
        if i >= 2 and 10 <= int(code[i - 2 : i]) <= 26:
            ways[i] += ways[i - 2]
        ways[i] %= MOD
    return ways[n]
