class Solution {
    private String[] maze;
    private boolean[][] visited;
    private int rows, cols;
    private static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    void dfs(int r, int c) {
        visited[r][c] = true;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr].charAt(nc) != '#' && !visited[nr][nc]) {
                dfs(nr, nc);
            }
        }
    }

    public boolean solution(String[] maze) {
        this.maze = maze;
        rows = maze.length;
        cols = maze[0].length();
        visited = new boolean[rows][cols];
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (maze[r].charAt(c) == 'S') dfs(r, c);
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (maze[r].charAt(c) == 'E') return visited[r][c];
        return false;
    }
}
