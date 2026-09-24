import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("push")) stack.push(Integer.parseInt(parts[1]));
            else if (!stack.isEmpty()) stack.pop();
        }
        // push는 맨 앞에 넣으므로, 아래 접시부터 담으려면 뒤집는다
        List<Integer> answer = new ArrayList<>(stack);
        Collections.reverse(answer);
        return answer;
    }
}
