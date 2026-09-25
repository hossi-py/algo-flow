import java.util.*;

class Solution {
    List<List<Integer>> graph = new ArrayList<>();
    boolean[] visited;
    List<Integer> answer = new ArrayList<>();

    public List<Integer> solution(int n, int[][] tunnels) {
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] t : tunnels) {
            graph.get(t[0]).add(t[1]);
            graph.get(t[1]).add(t[0]);
        }
        for (List<Integer> rooms : graph) Collections.sort(rooms);
        visited = new boolean[n];
        dfs(0);
        return answer;
    }

    void dfs(int u) {
        visited[u] = true;
        for (int v : graph.get(u)) {
            if (!visited[v]) dfs(v);
        }
        answer.add(u);
    }
}
