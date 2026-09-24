import java.util.*;

class Solution {
    public int[] solution(int[] heights) {
        int[] answer = new int[heights.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < heights.length; i++) {
            while (!stack.isEmpty() && heights[stack.peek()] <= heights[i]) stack.pop();
            answer[i] = stack.isEmpty() ? 0 : stack.peek() + 1;
            stack.push(i);
        }
        return answer;
    }
}
