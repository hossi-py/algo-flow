import java.util.*;

class Solution {
    int count(int[] h, int d) {
        int placed = 1, last = h[0];
        for (int i = 1; i < h.length; i++) {
            if (h[i] - last >= d) {
                placed++;
                last = h[i];
            }
        }
        return placed;
    }

    public int solution(int[] hooks, int c) {
        int[] h = hooks.clone();
        Arrays.sort(h);
        int lo = 1, hi = h[h.length - 1] - h[0], answer = 0;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (count(h, mid) >= c) {
                answer = mid;
                lo = mid + 1;
            } else hi = mid - 1;
        }
        return answer;
    }
}
