class Solution {
    public int solution(int[] coins, int amount) {
        final long MOD = 1_000_000_007L;
        long[] ways = new long[amount + 1];
        ways[0] = 1;
        for (int c : coins) {
            for (int a = c; a <= amount; a++) ways[a] = (ways[a] + ways[a - c]) % MOD;
        }
        return (int) ways[amount];
    }
}
