import java.util.*;

class Solution {
    public String solution(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(a[1], b[1]));
        for (int c = 0; c < 26; c++) if (count[c] > 0) h.offer(new int[] {count[c], c});
        StringBuilder out = new StringBuilder();
        int prev = -1;
        for (int t = 0; t < s.length(); t++) {
            int[] top = h.poll();
            if (top[1] == prev) {
                if (h.isEmpty()) return "";
                int[] second = h.poll();
                h.offer(top);
                top = second;
            }
            out.append((char) ('a' + top[1]));
            if (top[0] > 1) h.offer(new int[] {top[0] - 1, top[1]});
            prev = top[1];
        }
        return out.toString();
    }
}
