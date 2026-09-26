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

    public int solution(int n, int[][] links, int start) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] l : links) graph.get(l[0]).add(new int[] {l[1], l[2]});
        long[] dist = dijkstra(graph, start);
        long longest = 0;
        for (long d : dist) longest = Math.max(longest, d);
        return longest == INF ? -1 : (int) longest;
    }
}
