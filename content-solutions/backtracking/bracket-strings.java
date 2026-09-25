import java.util.*;

class Solution {
    private final List<String> result = new ArrayList<>();
    private int n;

    void make(String s, int open, int close) {
        if (s.length() == 2 * n) {
            result.add(s);
            return;
        }
        if (open < n) make(s + "(", open + 1, close);
        if (close < open) make(s + ")", open, close + 1);
    }

    public List<String> solution(int n) {
        this.n = n;
        make("", 0, 0);
        return result;
    }
}
