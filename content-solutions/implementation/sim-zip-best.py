def solution(s):
    def piece_len(chunk, cnt):
        return len(chunk) + (len(str(cnt)) if cnt > 1 else 0)

    best = len(s)
    for k in range(1, len(s) + 1):
        chunks = [s[i:i + k] for i in range(0, len(s), k)]
        length = 0
        prev, cnt = chunks[0], 1
        for chunk in chunks[1:]:
            if chunk == prev:
                cnt += 1
            else:
                length += piece_len(prev, cnt)
                prev, cnt = chunk, 1
        length += piece_len(prev, cnt)
        best = min(best, length)
    return best
