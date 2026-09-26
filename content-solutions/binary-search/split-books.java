class Solution {
    int people(int[] pages, long x) {
        int count = 1;
        long cur = 0;
        for (int p : pages) {
            if (cur + p > x) {
                count++;
                cur = 0;
            }
            cur += p;
        }
        return count;
    }

    public int solution(int[] pages, int k) {
        long lo = 0, hi = 0;
        for (int p : pages) {
            lo = Math.max(lo, p);
            hi += p;
        }
        long answer = hi;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            if (people(pages, mid) <= k) {
                answer = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return (int) answer;
    }
}
