class Solution {
    public int[][] solution(String[] grid) {
        int rows = grid.length, cols = grid[0].length();
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        int[][] answer = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r].charAt(c) == '#') {
                    answer[r][c] = -1;
                    continue;
                }
                int count = 0;
                for (int[] d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr].charAt(nc) == '.') count++;
                }
                answer[r][c] = count;
            }
        }
        return answer;
    }
}
