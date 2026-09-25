import java.util.*;

class Solution {
    public int solution(int[] scores, int k) {
        int n = scores.length;
        int[] best = new int[n];
        best[0] = scores[0];
        Deque<Integer> window = new ArrayDeque<>();
        window.addLast(0);
        for (int i = 1; i < n; i++) {
            while (window.peekFirst() < i - k) window.pollFirst();
            best[i] = scores[i] + best[window.peekFirst()];
            while (!window.isEmpty() && best[window.peekLast()] <= best[i]) window.pollLast();
            window.addLast(i);
        }
        return best[n - 1];
    }
}
