import java.util.*;

class Solution {
    public int[] solution(int[] temps) {
        int[] answer = new int[temps.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int today = 0; today < temps.length; today++) {
            while (!stack.isEmpty() && temps[stack.peek()] < temps[today]) {
                int day = stack.pop();
                answer[day] = today - day;
            }
            stack.push(today);
        }
        return answer;
    }
}
