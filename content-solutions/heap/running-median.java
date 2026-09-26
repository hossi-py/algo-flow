import java.util.*;

class Solution {
    public int[] solution(int[] heights) {
        PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> high = new PriorityQueue<>();
        int[] answer = new int[heights.length];
        for (int i = 0; i < heights.length; i++) {
            low.offer(heights[i]);
            high.offer(low.poll());
            if (high.size() > low.size()) low.offer(high.poll());
            answer[i] = low.peek();
        }
        return answer;
    }
}
