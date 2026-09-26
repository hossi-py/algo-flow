class Solution {
    public long solution(long n) {
        long lo = 0, hi = Math.min(n, 1000000L), answer = 0;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            if (mid * mid <= n) {
                answer = mid;
                lo = mid + 1;
            } else hi = mid - 1;
        }
        return answer;
    }
}
