class Solution {
    public int solution(int n, int[][] recs) {
        int[] inn = new int[n + 1];
        int[] out = new int[n + 1];
        for (int[] r : recs) {
            out[r[0]]++;
            inn[r[1]]++;
        }
        for (int x = 1; x <= n; x++) {
            if (inn[x] == n - 1 && out[x] == 0) return x;
        }
        return -1;
    }
}
