class Solution {
    public int solution(int[] prices) {
        long hold = Long.MIN_VALUE / 4, sold = 0, rest = 0;
        for (int p : prices) {
            long nextHold = Math.max(hold, rest - p);
            long nextSold = hold + p;
            long nextRest = Math.max(rest, sold);
            hold = nextHold;
            sold = nextSold;
            rest = nextRest;
        }
        return (int) Math.max(sold, rest);
    }
}
