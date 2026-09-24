import java.util.*;

class Solution {
    public int solution(int[] leap) {
        int n = leap.length;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[0] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(0);
        while (!queue.isEmpty()) {
            int i = queue.poll();
            for (int j : new int[] {i + leap[i], i - leap[i]}) {
                if (j >= 0 && j < n && dist[j] == -1) {
                    dist[j] = dist[i] + 1;
                    queue.offer(j);
                }
            }
        }
        return dist[n - 1];
    }
}
