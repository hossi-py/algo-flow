import heapq


def solution(s):
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    h = [(-n, c) for c, n in count.items()]
    heapq.heapify(h)
    out = []
    prev = ""
    for _ in range(len(s)):
        cnt, c = heapq.heappop(h)
        if c == prev:
            if not h:
                return ""
            second = heapq.heappop(h)
            heapq.heappush(h, (cnt, c))
            cnt, c = second
        out.append(c)
        if cnt + 1 < 0:
            heapq.heappush(h, (cnt + 1, c))
        prev = c
    return "".join(out)
