import java.util.*;

class Solution {
    public int solution(String[] maze) {
        int rows = maze.length, cols = maze[0].length();
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);
        Queue<int[]> queue = new ArrayDeque<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (maze[r].charAt(c) == 'S') {
                    dist[r][c] = 0;
                    queue.offer(new int[] {r, c});
                }
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            if (maze[r].charAt(c) == 'E') return dist[r][c];
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr].charAt(nc) != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    queue.offer(new int[] {nr, nc});
                }
            }
        }
        return -1;
    }
}
