import java.util.*;

class Solution {
    public int solution(int n, int[][] routes, int s, int t) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : routes) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(s);
        while (!queue.isEmpty()) {
            int v = queue.poll();
            if (v == t) return dist[v];
            for (int w : graph.get(v)) {
                if (dist[w] == -1) {
                    dist[w] = dist[v] + 1;
                    queue.offer(w);
                }
            }
        }
        return -1;
    }
}
