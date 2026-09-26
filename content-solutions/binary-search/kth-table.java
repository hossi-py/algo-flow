class Solution {
    long count(int n, long x) {
        long total = 0;
        for (int i = 1; i <= n; i++) total += Math.min(n, x / i);
        return total;
    }

    public int solution(int n, int k) {
        long lo = 1, hi = (long) n * n, answer = hi;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            if (count(n, mid) >= k) {
                answer = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return (int) answer;
    }
}
