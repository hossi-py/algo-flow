import java.util.*;

class Solution {
    private static final int MOD = 1_000_000_007;
    private List<List<Integer>> graph;
    private int[] memo;
    private int n;

    int ways(int v) {
        if (v == n - 1) return 1;
        if (memo[v] != -1) return memo[v];
        long total = 0;
        for (int w : graph.get(v)) total = (total + ways(w)) % MOD;
        memo[v] = (int) total;
        return memo[v];
    }

    public int solution(int n, int[][] trails) {
        this.n = n;
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : trails) {
            graph.get(e[0]).add(e[1]);
        }
        memo = new int[n];
        Arrays.fill(memo, -1);
        return ways(0);
    }
}
