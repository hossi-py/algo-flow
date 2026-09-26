class Solution {
    public int solution(int n, int secret) {
        long lo = 1, hi = n;
        int count = 0;
        while (true) {
            long mid = (lo + hi) / 2;
            count++;
            if (mid == secret) return count;
            if (mid < secret) lo = mid + 1;
            else hi = mid - 1;
        }
    }
}
