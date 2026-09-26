class Solution {
    public int[] solution(int[] prices, int target) {
        int l = 0, r = prices.length - 1;
        while (l < r) {
            int s = prices[l] + prices[r];
            if (s == target) return new int[] {l, r};
            if (s < target) l++;
            else r--;
        }
        return new int[0];
    }
}
