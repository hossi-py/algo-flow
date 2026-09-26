import java.util.*;

class Solution {
    public int solution(int n, int[][] flights, int src, int dst, int k) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] f : flights) graph.get(f[0]).add(new int[] {f[1], f[2]});
        int[][] dist = new int[n][k + 2];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[src][0] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.offer(new int[] {0, src, 0});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int cost = top[0], v = top[1], used = top[2];
            if (v == dst) return cost;
            if (cost > dist[v][used] || used == k + 1) continue;
            for (int[] x : graph.get(v)) {
                int nc = cost + x[1];
                if (nc < dist[x[0]][used + 1]) {
                    dist[x[0]][used + 1] = nc;
                    heap.offer(new int[] {nc, x[0], used + 1});
                }
            }
        }
        return -1;
    }
}
