class Solution {
    private int[] prices;
    private int money;

    int go(int i, int total) {
        if (i == prices.length) return total == money ? 1 : 0;
        return go(i + 1, total + prices[i]) + go(i + 1, total);
    }

    public int solution(int[] prices, int money) {
        this.prices = prices;
        this.money = money;
        return go(0, 0);
    }
}
