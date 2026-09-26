class Solution {
    public long solution(int[] times, int m) {
        long fastest = Long.MAX_VALUE;
        for (int t : times) fastest = Math.min(fastest, t);
        long lo = 1, hi = fastest * m, answer = hi;
        while (lo <= hi) {
            long mid = lo + (hi - lo) / 2;
            long made = 0;
            for (int t : times) {
                made += mid / t;
                if (made >= m) break;
            }
            if (made >= m) {
                answer = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return answer;
    }
}
