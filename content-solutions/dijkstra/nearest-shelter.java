import java.util.*;

class Solution {
    public int[] solution(int n, int[][] roads, int[] shelters) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int[] r : roads) {
            graph.get(r[0]).add(new int[] {r[1], r[2]});
            graph.get(r[1]).add(new int[] {r[0], r[2]});
        }
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        PriorityQueue<long[]> heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        for (int s : shelters) {
            dist[s] = 0;
            heap.offer(new long[] {0, s});
        }
        while (!heap.isEmpty()) {
            long[] top = heap.poll();
            long d = top[0];
            int v = (int) top[1];
            if (d > dist[v]) continue;
            for (int[] x : graph.get(v)) {
                if (d + x[1] < dist[x[0]]) {
                    dist[x[0]] = d + x[1];
                    heap.offer(new long[] {dist[x[0]], x[0]});
                }
            }
        }
        int[] answer = new int[n];
        for (int i = 0; i < n; i++) answer[i] = dist[i] == Long.MAX_VALUE ? -1 : (int) dist[i];
        return answer;
    }
}
