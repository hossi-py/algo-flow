import java.util.*;

class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();
    private int n, k;

    void pick(int start) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i <= n; i++) {
            path.add(i);
            pick(i + 1);
            path.remove(path.size() - 1);
        }
    }

    public List<List<Integer>> solution(int n, int k) {
        this.n = n;
        this.k = k;
        pick(1);
        return result;
    }
}
