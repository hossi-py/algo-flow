import java.util.*;

class Solution {
    public List<Integer> solution(int[] times) {
        Queue<Integer> window = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (int t : times) {
            window.offer(t);
            while (window.peek() < t - 3000) window.poll();
            answer.add(window.size());
        }
        return answer;
    }
}
