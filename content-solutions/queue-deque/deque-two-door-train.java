import java.util.*;

class Solution {
    public List<Integer> solution(String[] commands) {
        Deque<Integer> train = new ArrayDeque<>();
        for (String command : commands) {
            String[] parts = command.split(" ");
            switch (parts[0]) {
                case "push_front":
                    train.offerFirst(Integer.parseInt(parts[1]));
                    break;
                case "push_back":
                    train.offerLast(Integer.parseInt(parts[1]));
                    break;
                case "pop_front":
                    train.pollFirst();
                    break;
                default:
                    train.pollLast();
            }
        }
        return new ArrayList<>(train);
    }
}
