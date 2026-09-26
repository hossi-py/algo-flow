class Solution {
    public int solution(String code) {
        final long MOD = 1_000_000_007L;
        int n = code.length();
        long[] ways = new long[n + 1];
        ways[0] = 1;
        for (int i = 1; i <= n; i++) {
            if (code.charAt(i - 1) != '0') ways[i] += ways[i - 1];
            if (i >= 2) {
                int two = (code.charAt(i - 2) - '0') * 10 + (code.charAt(i - 1) - '0');
                if (two >= 10 && two <= 26) ways[i] += ways[i - 2];
            }
            ways[i] %= MOD;
        }
        return (int) ways[n];
    }
}
