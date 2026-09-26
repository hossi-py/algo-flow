import java.util.*;

class Solution {
    public int solution(int[] stones) {
        PriorityQueue<Integer> h = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) h.offer(s);
        while (h.size() >= 2) {
            int a = h.poll(), b = h.poll();
            if (a != b) h.offer(a - b);
        }
        return h.isEmpty() ? 0 : h.peek();
    }
}
