import java.util.*;

class Solution {
    public long solution(int k, int w, int[] profit, int[] need) {
        int n = profit.length;
        int[][] jobs = new int[n][];
        for (int i = 0; i < n; i++) jobs[i] = new int[] {need[i], profit[i]};
        Arrays.sort(jobs, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> h = new PriorityQueue<>(Collections.reverseOrder());
        long money = w;
        int i = 0;
        for (int t = 0; t < k; t++) {
            while (i < n && jobs[i][0] <= money) h.offer(jobs[i++][1]);
            if (h.isEmpty()) break;
            money += h.poll();
        }
        return money;
    }
}
