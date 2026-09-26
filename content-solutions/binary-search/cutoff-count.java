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

    public int[] solution(int[] scores, int[] queries) {
        int[] s = scores.clone();
        Arrays.sort(s);
        int[] answer = new int[queries.length];
        for (int i = 0; i < queries.length; i++) answer[i] = s.length - lowerBound(s, queries[i]);
        return answer;
    }
}
