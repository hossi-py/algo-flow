import java.util.*;

class Solution {
    public List<Integer> solution(int n, int[][] roads, int start) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) graph.get(r[0]).add(r[1]);
        boolean[] visited = new boolean[n];
        visited[start] = true;
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int u = stack.pop();
            for (int v : graph.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    stack.push(v);
                }
            }
        }
        List<Integer> answer = new ArrayList<>();
        for (int i = 0; i < n; i++) if (visited[i] && i != start) answer.add(i);
        return answer;
    }
}
