import java.util.*;

class Solution {
    public int[] solution(int n, int[][] pairs, int me) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] e : pairs) {
            graph.get(e[0]).add(e[1]);
            graph.get(e[1]).add(e[0]);
        }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[me] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(me);
        while (!queue.isEmpty()) {
            int v = queue.poll();
            for (int w : graph.get(v)) {
                if (dist[w] == -1) {
                    dist[w] = dist[v] + 1;
                    queue.offer(w);
                }
            }
        }
        return dist;
    }
}
