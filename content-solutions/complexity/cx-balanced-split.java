import java.util.*;

class Solution {
    public long solution(int[] nums) {
        long total = 0;
        for (int x : nums) total += x;
        long left = 0, best = Long.MAX_VALUE;
        for (int i = 0; i < nums.length - 1; i++) {
            left += nums[i];
            best = Math.min(best, Math.abs(left - (total - left)));
        }
        return best;
    }
}
