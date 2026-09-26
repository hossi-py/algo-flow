import java.util.*;

class Solution {
    public int solution(int[][] grid, int k) {
        int n = grid.length;
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        for (int r = 0; r < n; r++) h.offer(new int[] {grid[r][0], r, 0});
        int v = 0;
        for (int t = 0; t < k; t++) {
            int[] top = h.poll();
            v = top[0];
            int r = top[1], c = top[2];
            if (c + 1 < n) h.offer(new int[] {grid[r][c + 1], r, c + 1});
        }
        return v;
    }
}
