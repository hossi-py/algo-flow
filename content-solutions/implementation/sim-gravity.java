import java.util.*;

class Solution {
    public String[] solution(String[] grid) {
        int n = grid.length, m = grid[0].length();
        char[][] g = new char[n][];
        for (int r = 0; r < n; r++) g[r] = grid[r].toCharArray();
        for (int c = 0; c < m; c++) {
            int land = n - 1;
            for (int r = n - 1; r >= 0; r--) {
                char ch = g[r][c];
                if (ch == '#') land = r - 1;
                else if (ch != '.') {
                    g[r][c] = '.';
                    g[land][c] = ch;
                    land--;
                }
            }
        }
        String[] answer = new String[n];
        for (int r = 0; r < n; r++) answer[r] = new String(g[r]);
        return answer;
    }
}
