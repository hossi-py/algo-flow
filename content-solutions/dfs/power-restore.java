import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private boolean[] visited;

    int dfs(int v) {
        visited[v] = true;
        int count = 1;
        for (int w : graph.get(v)) {
            if (!visited[w]) count += dfs(w);
        }
        return count;
    }

    public int solution(int n, int[][] wires, int plant) {
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : wires) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        visited = new boolean[n];
        return dfs(plant);
    }
}
