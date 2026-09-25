import java.util.*;

class Solution {
    List<List<Integer>> graph = new ArrayList<>();
    int[] apples;
    int total, best;

    public int solution(int[] apples, int[][] roads) {
        this.apples = apples;
        int n = apples.length;
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(r[1]);
            graph.get(r[1]).add(r[0]);
        }
        for (int a : apples) total += a;
        best = total;
        dfs(0, -1);
        return best;
    }

    int dfs(int u, int parent) {
        int s = apples[u];
        for (int v : graph.get(u)) {
            if (v != parent) s += dfs(v, u);
        }
        if (parent != -1) best = Math.min(best, Math.abs(total - 2 * s));
        return s;
    }
}
