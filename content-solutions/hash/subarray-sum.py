def solution(nums, k):
    seen = {0: 1}
    total = 0
    answer = 0
    for x in nums:
        total += x
        answer += seen.get(total - k, 0)
        seen[total] = seen.get(total, 0) + 1
    return answer
