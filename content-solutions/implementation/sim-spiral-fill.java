import java.util.*;

class Solution {
    static final int[] DR = {0, 1, 0, -1};
    static final int[] DC = {1, 0, -1, 0};

    public int[][] solution(int n, int m) {
        int[][] board = new int[n][m];
        int r = 0, c = 0, d = 0;
        for (int k = 1; k <= n * m; k++) {
            board[r][c] = k;
            int nr = r + DR[d], nc = c + DC[d];
            if (nr < 0 || nr >= n || nc < 0 || nc >= m || board[nr][nc] != 0) d = (d + 1) % 4;
            r += DR[d];
            c += DC[d];
        }
        return board;
    }
}
