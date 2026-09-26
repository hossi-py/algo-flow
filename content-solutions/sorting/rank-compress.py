def solution(nums):
    u = sorted(set(nums))
    rank = {v: i for i, v in enumerate(u)}
    return [rank[x] for x in nums]
