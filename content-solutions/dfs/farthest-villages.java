import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] dist;

    void dfs(int v, int parent, int d) {
        dist[v] = d;
        for (int w : graph.get(v)) {
            if (w != parent) dfs(w, v, d + 1);
        }
    }

    int farthest(int start) {
        dfs(start, -1, 0);
        int best = 0;
        for (int v = 1; v < dist.length; v++) if (dist[v] > dist[best]) best = v;
        return best;
    }

    public int solution(int n, int[][] roads) {
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : roads) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        dist = new int[n];
        int a = farthest(0);
        int b = farthest(a);
        return dist[b];
    }
}
