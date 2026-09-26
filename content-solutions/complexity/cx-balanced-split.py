def solution(nums):
    total = sum(nums)
    left = 0
    best = float("inf")
    for i in range(len(nums) - 1):
        left += nums[i]
        best = min(best, abs(left - (total - left)))
    return best
