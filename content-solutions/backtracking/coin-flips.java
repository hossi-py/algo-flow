import java.util.*;

class Solution {
    private final List<String> result = new ArrayList<>();
    private final StringBuilder path = new StringBuilder();
    private int n;

    void pick() {
        if (path.length() == n) {
            result.add(path.toString());
            return;
        }
        for (char face : new char[] {'H', 'T'}) {
            path.append(face);
            pick();
            path.deleteCharAt(path.length() - 1);
        }
    }

    public List<String> solution(int n) {
        this.n = n;
        pick();
        return result;
    }
}
