import java.util.*;

class Solution {
    public int solution(String[] town) {
        int rows = town.length, cols = town[0].length();
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);
        Queue<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (town[r].charAt(c) == 'R') {
                    dist[r][c] = 0;
                    queue.offer(new int[] {r, c});
                }
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && town[nr].charAt(nc) == 'P' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[cell[0]][cell[1]] + 1;
                    queue.offer(new int[] {nr, nc});
                }
            }
        }
        int days = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (town[r].charAt(c) == 'P') {
                    if (dist[r][c] == -1) return -1;
                    days = Math.max(days, dist[r][c]);
                }
        return days;
    }
}
