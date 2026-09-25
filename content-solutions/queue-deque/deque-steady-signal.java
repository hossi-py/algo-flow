import java.util.*;

class Solution {
    public int solution(int[] signal, int limit) {
        Deque<Integer> maxq = new ArrayDeque<>();
        Deque<Integer> minq = new ArrayDeque<>();
        int left = 0, best = 0;
        for (int right = 0; right < signal.length; right++) {
            int value = signal[right];
            while (!maxq.isEmpty() && signal[maxq.peekLast()] <= value) maxq.pollLast();
            maxq.offerLast(right);
            while (!minq.isEmpty() && signal[minq.peekLast()] >= value) minq.pollLast();
            minq.offerLast(right);
            while (signal[maxq.peekFirst()] - signal[minq.peekFirst()] > limit) {
                left++;
                if (maxq.peekFirst() < left) maxq.pollFirst();
                if (minq.peekFirst() < left) minq.pollFirst();
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
