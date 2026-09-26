import java.util.*;

class Solution {
    public int solution(int[] positions) {
        int[] p = positions.clone();
        Arrays.sort(p);
        int best = Integer.MAX_VALUE;
        for (int i = 1; i < p.length; i++) best = Math.min(best, p[i] - p[i - 1]);
        return best;
    }
}
