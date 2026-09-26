class Solution {
    public int solution(int[] prices) {
        int lowest = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            if (lowest != Integer.MAX_VALUE) best = Math.max(best, p - lowest);
            lowest = Math.min(lowest, p);
        }
        return best;
    }
}
