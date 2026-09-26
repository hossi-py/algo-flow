import java.util.*;

class Solution {
    long[][] dist;
    PriorityQueue<long[]> heap;

    void relax(long nd, int w, int used) {
        if (nd < dist[w][used]) {
            dist[w][used] = nd;
            heap.offer(new long[] {nd, w, used});
        }
    }

    public int solution(int n, int[][] roads) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(new int[] {r[1], r[2]});
            graph.get(r[1]).add(new int[] {r[0], r[2]});
        }
        dist = new long[n][2];
        for (long[] row : dist) Arrays.fill(row, Long.MAX_VALUE);
        dist[0][0] = 0;
        heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        heap.offer(new long[] {0, 0, 0});
        while (!heap.isEmpty()) {
            long[] top = heap.poll();
            long d = top[0];
            int v = (int) top[1], used = (int) top[2];
            if (d > dist[v][used]) continue;
            for (int[] x : graph.get(v)) {
                relax(d + x[1], x[0], used);
                if (used == 0) relax(d + x[1] / 2, x[0], 1);
            }
        }
        long best = Math.min(dist[n - 1][0], dist[n - 1][1]);
        return best == Long.MAX_VALUE ? -1 : (int) best;
    }
}
