import java.util.*;

class Solution {
    public String solution(String[] votes) {
        Map<String, Integer> count = new HashMap<>();
        for (String v : votes) {
            count.put(v, count.getOrDefault(v, 0) + 1);
        }
        String best = null;
        for (Map.Entry<String, Integer> e : count.entrySet()) {
            String name = e.getKey();
            int c = e.getValue();
            if (best == null || c > count.get(best) || (c == count.get(best) && name.compareTo(best) < 0)) {
                best = name;
            }
        }
        return best;
    }
}
