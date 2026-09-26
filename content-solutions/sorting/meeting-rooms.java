import java.util.*;

class Solution {
    public int solution(int[][] meetings) {
        int[][] events = new int[meetings.length * 2][];
        for (int i = 0; i < meetings.length; i++) {
            events[2 * i] = new int[] {meetings[i][0], 1};
            events[2 * i + 1] = new int[] {meetings[i][1], -1};
        }
        Arrays.sort(events, (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
        int now = 0, best = 0;
        for (int[] e : events) {
            now += e[1];
            best = Math.max(best, now);
        }
        return best;
    }
}
