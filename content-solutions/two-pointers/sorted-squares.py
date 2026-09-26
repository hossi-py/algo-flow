def solution(nums):
    n = len(nums)
    result = [0] * n
    l, r, k = 0, n - 1, n - 1
    while l <= r:
        if abs(nums[l]) > abs(nums[r]):
            result[k] = nums[l] ** 2
            l += 1
        else:
            result[k] = nums[r] ** 2
            r -= 1
        k -= 1
    return result
