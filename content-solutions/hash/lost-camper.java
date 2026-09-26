import java.util.*;

class Solution {
    public String solution(String[] departed, String[] returned) {
        Map<String, Integer> count = new HashMap<>();
        for (String name : departed) count.put(name, count.getOrDefault(name, 0) + 1);
        for (String name : returned) count.put(name, count.get(name) - 1);
        for (Map.Entry<String, Integer> e : count.entrySet()) {
            if (e.getValue() > 0) return e.getKey();
        }
        return "";
    }
}
