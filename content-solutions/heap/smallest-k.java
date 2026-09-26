import java.util.*;

class Solution {
    public int[] solution(int[] weights, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        for (int w : weights) h.offer(w);
        int[] answer = new int[k];
        for (int i = 0; i < k; i++) answer[i] = h.poll();
        return answer;
    }
}
