import java.util.*;

class Solution {
    public int solution(int[] ropes) {
        int[] r = ropes.clone();
        Arrays.sort(r);
        int n = r.length, best = 0;
        for (int k = 1; k <= n; k++) best = Math.max(best, r[n - k] * k);
        return best;
    }
}
