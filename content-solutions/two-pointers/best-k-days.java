class Solution {
    public int solution(int[] profits, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) window += profits[i];
        int best = window;
        for (int i = k; i < profits.length; i++) {
            window += profits[i] - profits[i - k];
            best = Math.max(best, window);
        }
        return best;
    }
}
