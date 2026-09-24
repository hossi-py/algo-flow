class Solution {
    public boolean[] solution(int n, int[][] flights, int[][] queries) {
        boolean[][] table = new boolean[n][n];
        for (int[] f : flights) table[f[0]][f[1]] = true;
        boolean[] answer = new boolean[queries.length];
        for (int i = 0; i < queries.length; i++) answer[i] = table[queries[i][0]][queries[i][1]];
        return answer;
    }
}
