class Solution {
    static final long MOD = 1_000_000_007L;
    long[] memo;

    public int solution(int n) {
        memo = new long[n + 1];
        return (int) ways(n);
    }

    long ways(int k) {
        if (k <= 1) return 1;
        if (memo[k] != 0) return memo[k];
        memo[k] = (ways(k - 1) + 2 * ways(k - 2)) % MOD;
        return memo[k];
    }
}
