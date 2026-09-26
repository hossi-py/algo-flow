class Solution {
    public int solution(int[][] fatigue) {
        int rows = fatigue.length, cols = fatigue[0].length;
        int[][] best = new int[rows][];
        for (int r = 0; r < rows; r++) best[r] = fatigue[r].clone();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (r == 0 && c == 0) continue;
                int up = r > 0 ? best[r - 1][c] : Integer.MAX_VALUE;
                int left = c > 0 ? best[r][c - 1] : Integer.MAX_VALUE;
                best[r][c] += Math.min(up, left);
            }
        }
        return best[rows - 1][cols - 1];
    }
}
