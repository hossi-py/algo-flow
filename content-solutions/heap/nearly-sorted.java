import java.util.*;

class Solution {
    public int[] solution(int[] nums, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        int[] answer = new int[nums.length];
        int w = 0;
        for (int x : nums) {
            h.offer(x);
            if (h.size() > k) answer[w++] = h.poll();
        }
        while (!h.isEmpty()) answer[w++] = h.poll();
        return answer;
    }
}
