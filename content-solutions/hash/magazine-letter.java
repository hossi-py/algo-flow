import java.util.*;

class Solution {
    public boolean solution(String letters, String message) {
        Map<Character, Integer> have = new HashMap<>();
        for (char ch : letters.toCharArray()) have.put(ch, have.getOrDefault(ch, 0) + 1);
        for (char ch : message.toCharArray()) {
            if (have.getOrDefault(ch, 0) == 0) return false;
            have.put(ch, have.get(ch) - 1);
        }
        return true;
    }
}
