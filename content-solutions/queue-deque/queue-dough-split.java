import java.util.*;

class Solution {
    public List<Integer> solution(int[] doughs, int limit) {
        Deque<Integer> line = new ArrayDeque<>();
        for (int w : doughs) line.offer(w);
        List<Integer> answer = new ArrayList<>();
        while (!line.isEmpty()) {
            int w = line.poll();
            if (w <= limit) {
                answer.add(w);
            } else {
                line.offer(w / 2);
                line.offer(w - w / 2);
            }
        }
        return answer;
    }
}
