import java.util.*;

class Solution {
    public List<String> solution(String[] events) {
        Queue<String> line = new ArrayDeque<>();
        List<String> served = new ArrayList<>();
        for (String event : events) {
            String[] parts = event.split(" ");
            if (parts[0].equals("arrive")) line.offer(parts[1]);
            else if (!line.isEmpty()) served.add(line.poll());
        }
        return served;
    }
}
