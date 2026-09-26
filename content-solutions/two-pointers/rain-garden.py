def solution(heights):
    l, r = 0, len(heights) - 1
    lmax = rmax = 0
    water = 0
    while l <= r:
        if lmax <= rmax:
            lmax = max(lmax, heights[l])
            water += lmax - heights[l]
            l += 1
        else:
            rmax = max(rmax, heights[r])
            water += rmax - heights[r]
            r -= 1
    return water
