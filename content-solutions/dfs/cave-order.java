import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private boolean[] visited;
    private final List<Integer> order = new ArrayList<>();

    void dfs(int v) {
        visited[v] = true;
        order.add(v);
        for (int w : graph.get(v)) {
            if (!visited[w]) dfs(w);
        }
    }

    public List<Integer> solution(int n, int[][] tunnels, int start) {
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : tunnels) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        for (List<Integer> neighbors : graph) Collections.sort(neighbors);
        visited = new boolean[n];
        dfs(start);
        return order;
    }
}
