import java.util.*;

class Solution {
    List<List<Integer>> graph = new ArrayList<>();
    boolean[] visited;

    public boolean solution(int n, int[][] trails) {
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] t : trails) {
            graph.get(t[0]).add(t[1]);
            graph.get(t[1]).add(t[0]);
        }
        visited = new boolean[n];
        for (int s = 0; s < n; s++) {
            if (!visited[s] && dfs(s, -1)) return true;
        }
        return false;
    }

    boolean dfs(int u, int parent) {
        visited[u] = true;
        for (int v : graph.get(u)) {
            if (v == parent) continue;
            if (visited[v]) return true;
            if (dfs(v, u)) return true;
        }
        return false;
    }
}
