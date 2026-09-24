from collections import deque


def solution(signal, limit):
    maxq = deque()
    minq = deque()
    left = 0
    best = 0
    for right, value in enumerate(signal):
        while maxq and signal[maxq[-1]] <= value:
            maxq.pop()
        maxq.append(right)
        while minq and signal[minq[-1]] >= value:
            minq.pop()
        minq.append(right)
        while signal[maxq[0]] - signal[minq[0]] > limit:
            left += 1
            if maxq[0] < left:
                maxq.popleft()
            if minq[0] < left:
                minq.popleft()
        best = max(best, right - left + 1)
    return best
