import java.util.*;

class Solution {
    public int solution(String[] kinds) {
        Map<String, Integer> count = new HashMap<>();
        for (String kind : kinds) count.put(kind, count.getOrDefault(kind, 0) + 1);
        int ways = 1;
        for (int c : count.values()) {
            ways *= c + 1;
        }
        return ways - 1;
    }
}
