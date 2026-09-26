class Solution {
    public int solution(int[] acorns, int S) {
        int l = 0, best = Integer.MAX_VALUE;
        long total = 0;
        for (int r = 0; r < acorns.length; r++) {
            total += acorns[r];
            while (total >= S) {
                best = Math.min(best, r - l + 1);
                total -= acorns[l++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
