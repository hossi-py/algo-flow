import java.util.*;

class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int solution(String[] grid) {
        int rows = grid.length, cols = grid[0].length();
        int[][] broken = new int[rows][cols];
        for (int[] row : broken) Arrays.fill(row, Integer.MAX_VALUE);
        broken[0][0] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));
        heap.offer(new int[] {0, 0, 0});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int b = top[0], r = top[1], c = top[2];
            if (r == rows - 1 && c == cols - 1) return b;
            if (b > broken[r][c]) continue;
            for (int[] dir : DIRS) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int nb = b + (grid[nr].charAt(nc) == '1' ? 1 : 0);
                if (nb < broken[nr][nc]) {
                    broken[nr][nc] = nb;
                    heap.offer(new int[] {nb, nr, nc});
                }
            }
        }
        return -1;
    }
}
