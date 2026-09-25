import java.util.*;

class Solution {
    public List<List<Integer>> solution(int n, int[][] links, int start) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] l : links) {
            graph.get(l[0]).add(l[1]);
            graph.get(l[1]).add(l[0]);
        }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        int far = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            far = Math.max(far, dist[u]);
            for (int v : graph.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        List<List<Integer>> rings = new ArrayList<>();
        for (int d = 0; d <= far; d++) rings.add(new ArrayList<>());
        for (int i = 0; i < n; i++) if (dist[i] >= 0) rings.get(dist[i]).add(i);
        return rings;
    }
}
