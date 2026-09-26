import java.util.*;

class Solution {
    public String[] solution(String[] grid, int k) {
        int rows = grid.length, cols = grid[0].length();
        for (int t = 0; t < k; t++) {
            String[] next = new String[rows];
            for (int r = 0; r < rows; r++) {
                StringBuilder row = new StringBuilder();
                for (int c = 0; c < cols; c++) {
                    int cnt = 0;
                    for (int dr = -1; dr <= 1; dr++) {
                        for (int dc = -1; dc <= 1; dc++) {
                            if (dr == 0 && dc == 0) continue;
                            int nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr].charAt(nc) == '#') cnt++;
                        }
                    }
                    boolean alive = grid[r].charAt(c) == '#';
                    row.append(cnt == 3 || (alive && cnt == 2) ? '#' : '.');
                }
                next[r] = row.toString();
            }
            grid = next;
        }
        return grid;
    }
}
