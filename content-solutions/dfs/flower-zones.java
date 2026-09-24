import java.util.*;

class Solution {
    private static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    private String[] garden;
    private boolean[][] visited;
    private int n, m;

    int dfs(int r, int c) {
        visited[r][c] = true;
        int size = 1;
        for (int[] d : DIRECTIONS) {
            int nr = r + d[0], nc = c + d[1];
            if (0 <= nr && nr < n && 0 <= nc && nc < m && garden[nr].charAt(nc) == '1' && !visited[nr][nc]) {
                size += dfs(nr, nc);
            }
        }
        return size;
    }

    public List<Integer> solution(String[] garden) {
        this.garden = garden;
        n = garden.length;
        m = garden[0].length();
        visited = new boolean[n][m];
        List<Integer> sizes = new ArrayList<>();
        for (int r = 0; r < n; r++)
            for (int c = 0; c < m; c++)
                if (garden[r].charAt(c) == '1' && !visited[r][c]) sizes.add(dfs(r, c));
        Collections.sort(sizes);
        return sizes;
    }
}
