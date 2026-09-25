import java.util.*;

class Solution {
    public List<List<String>> solution(String[] commands) {
        Deque<String> line = new ArrayDeque<>();
        List<List<String>> answer = new ArrayList<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("arrive")) {
                line.offer(parts[1]);
            } else {
                List<String> group = new ArrayList<>();
                int count = Math.min(Integer.parseInt(parts[1]), line.size());
                for (int i = 0; i < count; i++) group.add(line.poll());
                answer.add(group);
            }
        }
        return answer;
    }
}
