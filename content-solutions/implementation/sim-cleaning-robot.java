import java.util.*;

class Solution {
    static final int[] DR = {-1, 0, 1, 0};
    static final int[] DC = {0, 1, 0, -1};

    public int solution(String[] room, int r, int c, int d) {
        int rows = room.length, cols = room[0].length();
        boolean[][] cleaned = new boolean[rows][cols];
        int count = 0;
        while (true) {
            if (!cleaned[r][c]) {
                cleaned[r][c] = true;
                count++;
            }
            boolean dirty = false;
            for (int k = 0; k < 4; k++) {
                int nr = r + DR[k], nc = c + DC[k];
                if (room[nr].charAt(nc) == '.' && !cleaned[nr][nc]) dirty = true;
            }
            if (!dirty) {
                int br = r - DR[d], bc = c - DC[d];
                if (room[br].charAt(bc) == '#') break;
                r = br;
                c = bc;
            } else {
                d = (d + 3) % 4;
                int fr = r + DR[d], fc = c + DC[d];
                if (room[fr].charAt(fc) == '.' && !cleaned[fr][fc]) {
                    r = fr;
                    c = fc;
                }
            }
        }
        return count;
    }
}
