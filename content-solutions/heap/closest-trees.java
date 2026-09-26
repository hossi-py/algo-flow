import java.util.*;

class Solution {
    public int[][] solution(int[][] trees, int k) {
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> {
            long da = (long) a[0] * a[0] + (long) a[1] * a[1];
            long db = (long) b[0] * b[0] + (long) b[1] * b[1];
            if (da != db) return Long.compare(da, db);
            return a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]);
        });
        for (int[] t : trees) h.offer(t);
        int[][] answer = new int[k][];
        for (int i = 0; i < k; i++) answer[i] = h.poll();
        return answer;
    }
}
