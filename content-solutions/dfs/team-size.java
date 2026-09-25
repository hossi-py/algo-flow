import java.util.*;

class Solution {
    private List<List<Integer>> children;
    private int[] sizes;

    int dfs(int v) {
        int total = 1;
        for (int w : children.get(v)) total += dfs(w);
        sizes[v] = total;
        return total;
    }

    public int[] solution(int[] boss) {
        int n = boss.length;
        children = new ArrayList<>();
        for (int i = 0; i < n; i++) children.add(new ArrayList<>());
        int root = 0;
        for (int i = 0; i < n; i++) {
            if (boss[i] == -1) root = i;
            else children.get(boss[i]).add(i);
        }
        sizes = new int[n];
        dfs(root);
        return sizes;
    }
}
