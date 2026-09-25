import java.util.*;

class Solution {
    public int solution(int n, int[][] roads, int start, int[] stores) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(r[1]);
            graph.get(r[1]).add(r[0]);
        }
        boolean[] isStore = new boolean[n];
        for (int s : stores) isStore[s] = true;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            if (isStore[u]) return dist[u];
            for (int v : graph.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return -1;
    }
}
