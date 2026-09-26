import java.util.*;

class Solution {
    public int solution(int[][] courses) {
        int[][] sorted = courses.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[1], b[1]));
        PriorityQueue<Integer> h = new PriorityQueue<>(Collections.reverseOrder());
        long time = 0;
        for (int[] c : sorted) {
            h.offer(c[0]);
            time += c[0];
            if (time > c[1]) time -= h.poll();
        }
        return h.size();
    }
}
