import java.util.*;

class Solution {
    public int[] solution(int[] arrivals, int buses, int interval, int capacity) {
        int[] answer = new int[arrivals.length];
        Arrays.fill(answer, -1);
        Deque<Integer> waiting = new ArrayDeque<>();
        int nxt = 0;
        for (int bus = 1; bus <= buses; bus++) {
            long time = (long) bus * interval;
            while (nxt < arrivals.length && arrivals[nxt] <= time) waiting.offer(nxt++);
            int count = Math.min(capacity, waiting.size());
            for (int i = 0; i < count; i++) answer[waiting.poll()] = bus;
        }
        return answer;
    }
}
