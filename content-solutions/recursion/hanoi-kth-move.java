class Solution {
    int[] kth(int n, int a, int b, int c, long k) {
        long half = (1L << (n - 1)) - 1;
        if (k <= half) return kth(n - 1, a, c, b, k);
        if (k == half + 1) return new int[] {a, b};
        return kth(n - 1, c, b, a, k - half - 1);
    }

    public int[] solution(int n, long k) {
        return kth(n, 1, 3, 2, k);
    }
}
