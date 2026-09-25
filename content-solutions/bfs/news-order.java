import java.util.*;

class Solution {
    public List<Integer> solution(int n, int[][] pairs, int start) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : pairs) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        for (List<Integer> neighbors : graph) Collections.sort(neighbors);
        boolean[] visited = new boolean[n];
        List<Integer> order = new ArrayList<>();
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        visited[start] = true;
        while (!queue.isEmpty()) {
            int v = queue.poll();
            order.add(v);
            for (int w : graph.get(v)) {
                if (!visited[w]) {
                    visited[w] = true;
                    queue.offer(w);
                }
            }
        }
        return order;
    }
}
