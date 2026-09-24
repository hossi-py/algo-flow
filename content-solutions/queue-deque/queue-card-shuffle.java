import java.util.*;

class Solution {
    public int solution(int n) {
        Queue<Integer> cards = new ArrayDeque<>();
        for (int i = 1; i <= n; i++) cards.offer(i);
        while (cards.size() > 1) {
            cards.poll();
            cards.offer(cards.poll());
        }
        return cards.peek();
    }
}
