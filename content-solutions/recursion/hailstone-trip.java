class Solution {
    public int solution(long n) {
        if (n == 1) return 0;
        long next = n % 2 == 0 ? n / 2 : 3 * n + 1;
        return 1 + solution(next);
    }
}
