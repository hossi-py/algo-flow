class Solution {
    public int solution(int n) {
        final long MOD = 1_000_000_007L;
        long[] ways = new long[n + 1];
        ways[0] = 1;
        ways[1] = 1;
        for (int i = 2; i <= n; i++) ways[i] = (ways[i - 1] + ways[i - 2]) % MOD;
        return (int) ways[n];
    }
}
