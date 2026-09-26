import java.util.*;

class Solution {
    public int solution(int[][] balloons) {
        int[][] sorted = balloons.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[1], b[1]));
        long arrow = Long.MIN_VALUE;
        int count = 0;
        for (int[] b : sorted) {
            if (b[0] > arrow) {
                count++;
                arrow = b[1];
            }
        }
        return count;
    }
}
