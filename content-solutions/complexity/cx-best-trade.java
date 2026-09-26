import java.util.*;

class Solution {
    public int solution(int[] prices) {
        int best = 0, low = prices[0];
        for (int p : prices) {
            best = Math.max(best, p - low);
            low = Math.min(low, p);
        }
        return best;
    }
}
