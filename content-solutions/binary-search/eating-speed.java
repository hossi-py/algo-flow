class Solution {
    public int solution(int[] piles, int hours) {
        long lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        long answer = hi;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long need = 0;
            for (int p : piles) need += (p + mid - 1) / mid;
            if (need <= hours) {
                answer = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return (int) answer;
    }
}
