class Solution {
    public int solution(int[] heights) {
        int l = 0, r = heights.length - 1, lmax = 0, rmax = 0, water = 0;
        while (l <= r) {
            if (lmax <= rmax) {
                lmax = Math.max(lmax, heights[l]);
                water += lmax - heights[l];
                l++;
            } else {
                rmax = Math.max(rmax, heights[r]);
                water += rmax - heights[r];
                r--;
            }
        }
        return water;
    }
}
