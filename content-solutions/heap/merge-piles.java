import java.util.*;

class Solution {
    public long solution(int[] piles) {
        PriorityQueue<Long> h = new PriorityQueue<>();
        for (int p : piles) h.offer((long) p);
        long total = 0;
        while (h.size() >= 2) {
            long a = h.poll(), b = h.poll();
            total += a + b;
            h.offer(a + b);
        }
        return total;
    }
}
