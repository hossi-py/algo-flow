import heapq


def solution(words, k):
    count = {}
    for w in words:
        count[w] = count.get(w, 0) + 1
    h = [(-c, w) for w, c in count.items()]
    heapq.heapify(h)
    return [heapq.heappop(h)[1] for _ in range(k)]
