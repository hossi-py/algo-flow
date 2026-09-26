import java.util.*;

class Solution {
    public int[] solution(int n, int[][] bars) {
        int[][] sorted = bars.clone();
        Arrays.sort(sorted, (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
        int[] at = new int[n];
        for (int i = 0; i < n; i++) at[i] = i;
        for (int[] bar : sorted) {
            int col = bar[1];
            int t = at[col];
            at[col] = at[col + 1];
            at[col + 1] = t;
        }
        int[] answer = new int[n];
        for (int col = 0; col < n; col++) answer[at[col]] = col;
        return answer;
    }
}
