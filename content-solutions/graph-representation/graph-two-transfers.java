class Solution {
    public int[][] solution(int[][] routes) {
        int n = routes.length;
        int[][] answer = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                if (routes[i][k] == 0) continue;
                for (int j = 0; j < n; j++) {
                    if (routes[k][j] == 1) answer[i][j] = 1;
                }
            }
        }
        return answer;
    }
}
