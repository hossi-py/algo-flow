import java.util.*;

class Solution {
    static final long MOD = 1_000_000_007L;

    public int solution(int n, int[][] roads) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(new int[] {r[1], r[2]});
            graph.get(r[1]).add(new int[] {r[0], r[2]});
        }
        long[] dist = new long[n];
        long[] ways = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[0] = 0;
        ways[0] = 1;
        PriorityQueue<long[]> heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        heap.offer(new long[] {0, 0});
        while (!heap.isEmpty()) {
            long[] top = heap.poll();
            long d = top[0];
            int v = (int) top[1];
            if (d > dist[v]) continue;
            for (int[] x : graph.get(v)) {
                int w = x[0];
                if (d + x[1] < dist[w]) {
                    dist[w] = d + x[1];
                    ways[w] = ways[v];
                    heap.offer(new long[] {dist[w], w});
                } else if (d + x[1] == dist[w]) {
                    ways[w] = (ways[w] + ways[v]) % MOD;
                }
            }
        }
        return (int) ways[n - 1];
    }
}
