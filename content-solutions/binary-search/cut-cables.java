class Solution {
    public int solution(int[] vines, int k) {
        long lo = 1, hi = 0, answer = 0;
        for (int v : vines) hi = Math.max(hi, v);
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long pieces = 0;
            for (int v : vines) pieces += v / mid;
            if (pieces >= k) {
                answer = mid;
                lo = mid + 1;
            } else hi = mid - 1;
        }
        return (int) answer;
    }
}
