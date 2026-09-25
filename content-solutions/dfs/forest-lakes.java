class Solution {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    String[] forest;
    boolean[][] seen;
    int rows, cols;

    public int solution(String[] forest) {
        this.forest = forest;
        rows = forest.length;
        cols = forest[0].length();
        seen = new boolean[rows][cols];
        int lakes = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (forest[r].charAt(c) == '.' && !seen[r][c] && !fill(r, c)) lakes++;
            }
        }
        return lakes;
    }

    boolean fill(int r, int c) {
        seen[r][c] = true;
        boolean touches = r == 0 || r == rows - 1 || c == 0 || c == cols - 1;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && forest[nr].charAt(nc) == '.' && !seen[nr][nc]) {
                if (fill(nr, nc)) touches = true;
            }
        }
        return touches;
    }
}
