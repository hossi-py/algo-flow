import java.util.*;

class Solution {
    public List<Integer> solution(int n, int k) {
        Queue<Integer> circle = new ArrayDeque<>();
        for (int i = 1; i <= n; i++) circle.offer(i);
        List<Integer> out = new ArrayList<>();
        while (!circle.isEmpty()) {
            for (int i = 0; i < k - 1; i++) circle.offer(circle.poll());
            out.add(circle.poll());
        }
        return out;
    }
}
