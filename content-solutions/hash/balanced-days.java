import java.util.*;

class Solution {
    public int solution(int[] days) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int total = 0;
        int best = 0;
        for (int i = 0; i < days.length; i++) {
            total += days[i] == 1 ? 1 : -1;
            if (first.containsKey(total)) best = Math.max(best, i - first.get(total));
            else first.put(total, i);
        }
        return best;
    }
}
