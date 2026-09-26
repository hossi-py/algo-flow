import java.util.*;

class Solution {
    static int lowerBound(int[] a, long x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] >= x) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    public int[] solution(int[] heights, int[][] ranges) {
        int[] s = heights.clone();
        Arrays.sort(s);
        int[] answer = new int[ranges.length];
        for (int i = 0; i < ranges.length; i++) {
            answer[i] = lowerBound(s, (long) ranges[i][1] + 1) - lowerBound(s, ranges[i][0]);
        }
        return answer;
    }
}
