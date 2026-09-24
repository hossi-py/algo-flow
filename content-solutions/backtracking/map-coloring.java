import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] color;
    private int n, k;

    int paint(int v) {
        if (v == n) return 1;
        int count = 0;
        for (int c = 0; c < k; c++) {
            boolean clash = false;
            for (int w : graph.get(v)) if (color[w] == c) clash = true;
            if (clash) continue;
            color[v] = c;
            count += paint(v + 1);
            color[v] = -1;
        }
        return count;
    }

    public int solution(int n, int[][] borders, int k) {
        this.n = n;
        this.k = k;
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] b : borders) {
            graph.get(b[0]).add(b[1]);
            graph.get(b[1]).add(b[0]);
        }
        color = new int[n];
        Arrays.fill(color, -1);
        return paint(0);
    }
}
