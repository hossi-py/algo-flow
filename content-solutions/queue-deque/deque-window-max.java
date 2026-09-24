import java.util.*;

class Solution {
    public List<Integer> solution(int[] temps, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (int i = 0; i < temps.length; i++) {
            while (!dq.isEmpty() && temps[dq.peekLast()] <= temps[i]) dq.pollLast();
            dq.offerLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) answer.add(temps[dq.peekFirst()]);
        }
        return answer;
    }
}
