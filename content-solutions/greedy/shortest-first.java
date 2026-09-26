import java.util.*;

class Solution {
    public long solution(int[] times) {
        int[] sorted = times.clone();
        Arrays.sort(sorted);
        long now = 0, total = 0;
        for (int t : sorted) {
            now += t;
            total += now;
        }
        return total;
    }
}
