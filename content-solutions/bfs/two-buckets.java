import java.util.*;

class Solution {
    public int solution(int a, int b, int k) {
        int[][] dist = new int[a + 1][b + 1];
        for (int[] row : dist) Arrays.fill(row, -1);
        dist[0][0] = 0;
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[] {0, 0});
        while (!queue.isEmpty()) {
            int[] state = queue.poll();
            int x = state[0], y = state[1];
            if (x == k || y == k) return dist[x][y];
            int ab = Math.min(x, b - y);
            int ba = Math.min(y, a - x);
            int[][] next = {{a, y}, {x, b}, {0, y}, {x, 0}, {x - ab, y + ab}, {x + ba, y - ba}};
            for (int[] s : next) {
                if (dist[s[0]][s[1]] == -1) {
                    dist[s[0]][s[1]] = dist[x][y] + 1;
                    queue.offer(s);
                }
            }
        }
        return -1;
    }
}
