import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> lane = new ArrayDeque<>();
        List<Integer> answer = new ArrayList<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            if (parts[0].equals("in")) lane.push(Integer.parseInt(parts[1]));
            else if (!lane.isEmpty()) answer.add(lane.pop());
        }
        while (!lane.isEmpty()) answer.add(lane.pop());
        return answer;
    }
}
