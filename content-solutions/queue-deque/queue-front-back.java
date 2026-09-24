import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> line = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            switch (parts[0]) {
                case "enqueue":
                    line.offerLast(Integer.parseInt(parts[1]));
                    break;
                case "dequeue":
                    line.pollFirst();
                    break;
                case "front":
                    answer.add(line.isEmpty() ? -1 : line.peekFirst());
                    break;
                default:
                    answer.add(line.isEmpty() ? -1 : line.peekLast());
            }
        }
        return answer;
    }
}
