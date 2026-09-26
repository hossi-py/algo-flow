import java.util.*;

class Solution {
    public int solution(int[] scores, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        for (int s : scores) {
            h.offer(s);
            if (h.size() > k) h.poll();
        }
        return h.peek();
    }
}
