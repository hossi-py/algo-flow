import java.util.*;

class Solution {
    public int solution(int goal, int start, int[][] springs) {
        PriorityQueue<Integer> h = new PriorityQueue<>(Collections.reverseOrder());
        long fuel = start;
        int stops = 0;
        for (int i = 0; i <= springs.length; i++) {
            long pos = i < springs.length ? springs[i][0] : goal;
            while (fuel < pos) {
                if (h.isEmpty()) return -1;
                fuel += h.poll();
                stops++;
            }
            if (i < springs.length) h.offer(springs[i][1]);
        }
        return stops;
    }
}
