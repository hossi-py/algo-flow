def solution(nums, target):
    nums = sorted(nums)
    n = len(nums)
    best = None
    for i in range(n - 2):
        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if best is None or (abs(s - target), s) < (abs(best - target), best):
                best = s
            if s < target:
                l += 1
            elif s > target:
                r -= 1
            else:
                return s
    return best
