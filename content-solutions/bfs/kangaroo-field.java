import java.util.*;

class Solution {
    static final int[][] JUMPS = {{1, 2}, {2, 1}, {2, -1}, {1, -2}, {-1, -2}, {-2, -1}, {-2, 1}, {-1, 2}};

    public int solution(String[] field) {
        int rows = field.length, cols = field[0].length();
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);
        Deque<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (field[r].charAt(c) == 'S') {
                    dist[r][c] = 0;
                    queue.offer(new int[] {r, c});
                }
            }
        }
        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            int r = cur[0], c = cur[1];
            if (field[r].charAt(c) == 'E') return dist[r][c];
            for (int[] j : JUMPS) {
                int nr = r + j[0], nc = c + j[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && field[nr].charAt(nc) != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    queue.offer(new int[] {nr, nc});
                }
            }
        }
        return -1;
    }
}
