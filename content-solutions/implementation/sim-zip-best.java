import java.util.*;

class Solution {
    int pieceLen(String chunk, int cnt) {
        return chunk.length() + (cnt > 1 ? String.valueOf(cnt).length() : 0);
    }

    public int solution(String s) {
        int best = s.length();
        for (int k = 1; k <= s.length(); k++) {
            List<String> chunks = new ArrayList<>();
            for (int i = 0; i < s.length(); i += k) chunks.add(s.substring(i, Math.min(s.length(), i + k)));
            int length = 0, cnt = 1;
            String prev = chunks.get(0);
            for (int i = 1; i < chunks.size(); i++) {
                if (chunks.get(i).equals(prev)) cnt++;
                else {
                    length += pieceLen(prev, cnt);
                    prev = chunks.get(i);
                    cnt = 1;
                }
            }
            length += pieceLen(prev, cnt);
            best = Math.min(best, length);
        }
        return best;
    }
}
