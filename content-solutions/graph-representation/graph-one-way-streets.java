class Solution {
    public int[][] solution(int n, int[][] roads) {
        int[] out = new int[n];
        int[] inn = new int[n];
        for (int[] road : roads) {
            out[road[0]]++;
            inn[road[1]]++;
        }
        int[][] answer = new int[n][2];
        for (int i = 0; i < n; i++) answer[i] = new int[] {out[i], inn[i]};
        return answer;
    }
}
