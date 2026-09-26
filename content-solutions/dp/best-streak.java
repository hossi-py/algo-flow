class Solution {
    public int solution(int[] profits) {
        int cur = profits[0], best = profits[0];
        for (int i = 1; i < profits.length; i++) {
            cur = Math.max(profits[i], cur + profits[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}
