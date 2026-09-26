import java.util.*;

class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int solution(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[0][0] = grid[0][0];
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.offer(new int[] {grid[0][0], 0, 0});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int d = top[0], r = top[1], c = top[2];
            if (r == rows - 1 && c == cols - 1) return d;
            if (d > dist[r][c]) continue;
            for (int[] dir : DIRS) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int nd = d + grid[nr][nc];
                if (nd < dist[nr][nc]) {
                    dist[nr][nc] = nd;
                    heap.offer(new int[] {nd, nr, nc});
                }
            }
        }
        return -1;
    }
}
