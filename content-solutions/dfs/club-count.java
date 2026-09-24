import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private boolean[] visited;

    void dfs(int v) {
        visited[v] = true;
        for (int w : graph.get(v)) {
            if (!visited[w]) dfs(w);
        }
    }

    public int solution(int n, int[][] pairs) {
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : pairs) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        visited = new boolean[n];
        int count = 0;
        for (int v = 0; v < n; v++) {
            if (!visited[v]) {
                count++;
                dfs(v);
            }
        }
        return count;
    }
}
