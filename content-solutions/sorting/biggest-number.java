import java.util.*;

class Solution {
    public String solution(int[] cards) {
        String[] s = new String[cards.length];
        for (int i = 0; i < cards.length; i++) s[i] = String.valueOf(cards[i]);
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));
        StringBuilder sb = new StringBuilder();
        for (String x : s) sb.append(x);
        String r = sb.toString();
        return r.charAt(0) == '0' ? "0" : r;
    }
}
