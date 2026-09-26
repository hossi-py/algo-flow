import java.util.*;

class Solution {
    public int solution(int[][] meetings) {
        int[][] sorted = meetings.clone();
        Arrays.sort(sorted, (a, b) -> a[1] != b[1] ? Integer.compare(a[1], b[1]) : Integer.compare(a[0], b[0]));
        long lastEnd = Long.MIN_VALUE;
        int count = 0;
        for (int[] m : sorted) {
            if (m[0] >= lastEnd) {
                count++;
                lastEnd = m[1];
            }
        }
        return count;
    }
}
