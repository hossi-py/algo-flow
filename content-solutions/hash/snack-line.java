import java.util.*;

class Solution {
    public int solution(String shelf) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0;
        int best = 0;
        for (int right = 0; right < shelf.length(); right++) {
            char c = shelf.charAt(right);
            if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
            last.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
