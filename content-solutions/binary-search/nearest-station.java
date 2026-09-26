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

    public int[] solution(int[] stations, int[] homes) {
        int[] s = stations.clone();
        Arrays.sort(s);
        int[] answer = new int[homes.length];
        for (int k = 0; k < homes.length; k++) {
            int h = homes[k];
            int i = lowerBound(s, h);
            int best = Integer.MAX_VALUE;
            if (i < s.length) best = s[i] - h;
            if (i > 0) best = Math.min(best, h - s[i - 1]);
            answer[k] = best;
        }
        return answer;
    }
}
