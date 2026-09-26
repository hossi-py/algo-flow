import java.util.*;

class Solution {
    public int[][] solution(int[][] matrix, int k) {
        int[][] a = matrix;
        for (int t = 0; t < k % 4; t++) {
            int n = a.length, m = a[0].length;
            int[][] b = new int[m][n];
            for (int r = 0; r < n; r++)
                for (int c = 0; c < m; c++) b[c][n - 1 - r] = a[r][c];
            a = b;
        }
        return a;
    }
}
