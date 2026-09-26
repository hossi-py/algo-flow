import java.util.*;

class Solution {
    public List<List<String>> solution(String[] words) {
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : words) {
            char[] letters = w.toCharArray();
            Arrays.sort(letters);
            String key = new String(letters);
            groups.computeIfAbsent(key, x -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
}
