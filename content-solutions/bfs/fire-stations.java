import java.util.*;

class Solution {
    public int solution(int n, int[][] roads, int[] stations) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(r[1]);
            graph.get(r[1]).add(r[0]);
        }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        Deque<Integer> queue = new ArrayDeque<>();
        for (int s : stations) {
            dist[s] = 0;
            queue.offer(s);
        }
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : graph.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        int farthest = 0;
        for (int d : dist) {
            if (d == -1) return -1;
            farthest = Math.max(farthest, d);
        }
        return farthest;
    }
}
