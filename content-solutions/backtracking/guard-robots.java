class Solution {
    private boolean[] cols, diag1, diag2;
    private int n;

    int place(int row) {
        if (row == n) return 1;
        int count = 0;
        for (int c = 0; c < n; c++) {
            if (cols[c] || diag1[row - c + n] || diag2[row + c]) continue;
            cols[c] = diag1[row - c + n] = diag2[row + c] = true;
            count += place(row + 1);
            cols[c] = diag1[row - c + n] = diag2[row + c] = false;
        }
        return count;
    }

    public int solution(int n) {
        this.n = n;
        cols = new boolean[n];
        diag1 = new boolean[2 * n];
        diag2 = new boolean[2 * n];
        return place(0);
    }
}
