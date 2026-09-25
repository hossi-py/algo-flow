import java.util.*;

class Solution {
    public List<Integer> solution(int[] sizes) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int size : sizes) {
            int ball = size;
            while (!stack.isEmpty() && stack.peek() == ball) {
                stack.pop();
                ball *= 2;
            }
            stack.push(ball);
        }
        List<Integer> answer = new ArrayList<>(stack);
        Collections.reverse(answer);
        return answer;
    }
}
