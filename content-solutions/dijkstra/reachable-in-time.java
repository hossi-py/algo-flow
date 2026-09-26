import java.util.*;

class Solution {
    static final long INF = Long.MAX_VALUE / 4;

    long[] dijkstra(List<List<int[]>> graph, int start) {
        long[] dist = new long[graph.size()];
        Arrays.fill(dist, INF);
        dist[start] = 0;
        PriorityQueue<long[]> heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        heap.offer(new long[] {0, start});
        while (!heap.isEmpty()) {
            long[] top = heap.poll();
            long d = top[0];
            int v = (int) top[1];
            if (d > dist[v]) continue;
            for (int[] e : graph.get(v)) {
                if (d + e[1] < dist[e[0]]) {
                    dist[e[0]] = d + e[1];
                    heap.offer(new long[] {dist[e[0]], e[0]});
                }
            }
        }
        return dist;
    }

    public int solution(int n, int[][] roads, int limit) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(new int[] {r[1], r[2]});
            graph.get(r[1]).add(new int[] {r[0], r[2]});
        }
        long[] dist = dijkstra(graph, 0);
        int count = 0;
        for (long d : dist) if (d <= limit) count++;
        return count;
    }
}
