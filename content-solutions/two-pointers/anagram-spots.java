import java.util.*;

class Solution {
    public List<Integer> solution(String text, String word) {
        int m = word.length();
        int[] need = new int[26], have = new int[26];
        for (char c : word.toCharArray()) need[c - 'a']++;
        List<Integer> answer = new ArrayList<>();
        for (int i = 0; i < text.length(); i++) {
            have[text.charAt(i) - 'a']++;
            if (i >= m) have[text.charAt(i - m) - 'a']--;
            if (i >= m - 1 && Arrays.equals(have, need)) answer.add(i - m + 1);
        }
        return answer;
    }
}
