import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> stack = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("push")) stack.push(Integer.parseInt(parts[1]));
            else if (parts[0].equals("pop")) {
                if (!stack.isEmpty()) stack.pop();
            } else answer.add(stack.isEmpty() ? -1 : stack.peek());
        }
        return answer;
    }
}
