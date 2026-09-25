import java.util.*;

class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int solution(String[] room) {
        int rows = room.length, cols = room[0].length();
        boolean[][][] visited = new boolean[2][rows][cols];
        Deque<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (room[r].charAt(c) == 'S') {
                    visited[0][r][c] = true;
                    queue.offer(new int[] {r, c, 0, 0});
                }
            }
        }
        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            int r = cur[0], c = cur[1], key = cur[2], dist = cur[3];
            if (room[r].charAt(c) == 'E') return dist;
            for (int[] d : DIRS) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || room[nr].charAt(nc) == '#') continue;
                if (room[nr].charAt(nc) == 'D' && key == 0) continue;
                int nkey = key == 1 || room[nr].charAt(nc) == 'K' ? 1 : 0;
                if (!visited[nkey][nr][nc]) {
                    visited[nkey][nr][nc] = true;
                    queue.offer(new int[] {nr, nc, nkey, dist + 1});
                }
            }
        }
        return -1;
    }
}
