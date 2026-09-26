import java.util.*;

class Solution {
    static final int[] DR = {-1, 0, 1, 0};
    static final int[] DC = {0, 1, 0, -1};

    public int[] solution(String[] grid, String commands) {
        int rows = grid.length, cols = grid[0].length();
        int r = 0, c = 0, d = 0;
        for (int i = 0; i < rows; i++) {
            int j = grid[i].indexOf('S');
            if (j >= 0) {
                r = i;
                c = j;
            }
        }
        for (char ch : commands.toCharArray()) {
            if (ch == 'L') d = (d + 3) % 4;
            else if (ch == 'R') d = (d + 1) % 4;
            else {
                int nr = r + DR[d], nc = c + DC[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr].charAt(nc) != '#') {
                    r = nr;
                    c = nc;
                }
            }
        }
        return new int[] {r, c};
    }
}
