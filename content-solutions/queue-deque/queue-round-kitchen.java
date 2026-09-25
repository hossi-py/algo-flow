import java.util.*;

class Solution {
    public List<String> solution(Object[][] dishes, int q) {
        Queue<Object[]> line = new ArrayDeque<>();
        for (Object[] dish : dishes) line.offer(new Object[] {dish[0], dish[1]});
        List<String> done = new ArrayList<>();
        while (!line.isEmpty()) {
            Object[] dish = line.poll();
            String name = (String) dish[0];
            int left = (int) dish[1];
            if (left - q <= 0) done.add(name);
            else line.offer(new Object[] {name, left - q});
        }
        return done;
    }
}
