import java.util.*;

class Solution {
    public int solution(int[] prices, int budget) {
        int[] sorted = prices.clone();
        Arrays.sort(sorted);
        int count = 0;
        for (int p : sorted) {
            if (p > budget) break;
            budget -= p;
            count++;
        }
        return count;
    }
}
