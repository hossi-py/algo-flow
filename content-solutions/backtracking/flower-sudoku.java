import java.util.*;

class Solution {
    char[][] grid = new char[6][];
    List<int[]> blanks = new ArrayList<>();

    public String[] solution(String[] garden) {
        for (int r = 0; r < 6; r++) {
            grid[r] = garden[r].toCharArray();
            for (int c = 0; c < 6; c++) if (grid[r][c] == '.') blanks.add(new int[] {r, c});
        }
        fill(0);
        String[] answer = new String[6];
        for (int r = 0; r < 6; r++) answer[r] = new String(grid[r]);
        return answer;
    }

    boolean fits(int r, int c, char flower) {
        for (int i = 0; i < 6; i++) {
            if (grid[r][i] == flower || grid[i][c] == flower) return false;
        }
        int top = r / 2 * 2, left = c / 3 * 3;
        for (int i = top; i < top + 2; i++) {
            for (int j = left; j < left + 3; j++) if (grid[i][j] == flower) return false;
        }
        return true;
    }

    boolean fill(int k) {
        if (k == blanks.size()) return true;
        int r = blanks.get(k)[0], c = blanks.get(k)[1];
        for (char flower = '1'; flower <= '6'; flower++) {
            if (fits(r, c, flower)) {
                grid[r][c] = flower;
                if (fill(k + 1)) return true;
                grid[r][c] = '.';
            }
        }
        return false;
    }
}
