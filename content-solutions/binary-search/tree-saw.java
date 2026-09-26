class Solution {
    public int solution(int[] trees, int m) {
        long lo = 0, hi = 0, answer = 0;
        for (int t : trees) hi = Math.max(hi, t);
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long got = 0;
            for (int t : trees) if (t > mid) got += t - mid;
            if (got >= m) {
                answer = mid;
                lo = mid + 1;
            } else hi = mid - 1;
        }
        return (int) answer;
    }
}
