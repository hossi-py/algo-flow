import java.util.*;

class Solution {
    public int[] solution(int[] prices, int budget) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int j = 0; j < prices.length; j++) {
            int need = budget - prices[j];
            if (seen.containsKey(need)) return new int[] {seen.get(need), j};
            seen.putIfAbsent(prices[j], j);
        }
        return new int[0];
    }
}
