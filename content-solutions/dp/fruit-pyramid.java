class Solution {
    public int solution(int[][] pyramid) {
        int[] best = pyramid[pyramid.length - 1].clone();
        for (int r = pyramid.length - 2; r >= 0; r--) {
            for (int c = 0; c <= r; c++) best[c] = pyramid[r][c] + Math.max(best[c], best[c + 1]);
        }
        return best[0];
    }
}
