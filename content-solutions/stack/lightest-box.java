import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> stack = new ArrayDeque<>();
        Deque<Integer> mins = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("push")) {
                int w = Integer.parseInt(parts[1]);
                stack.push(w);
                mins.push(mins.isEmpty() ? w : Math.min(w, mins.peek()));
            } else if (parts[0].equals("pop")) {
                if (!stack.isEmpty()) {
                    stack.pop();
                    mins.pop();
                }
            } else {
                answer.add(mins.isEmpty() ? -1 : mins.peek());
            }
        }
        return answer;
    }
}
