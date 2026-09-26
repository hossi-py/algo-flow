import java.util.*;

class Solution {
    public boolean solution(String pattern, String[] words) {
        if (pattern.length() != words.length) return false;
        Map<Character, String> toWord = new HashMap<>();
        Map<String, Character> toChar = new HashMap<>();
        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String w = words[i];
            if (toWord.containsKey(c) && !toWord.get(c).equals(w)) return false;
            if (toChar.containsKey(w) && toChar.get(w) != c) return false;
            toWord.put(c, w);
            toChar.put(w, c);
        }
        return true;
    }
}
