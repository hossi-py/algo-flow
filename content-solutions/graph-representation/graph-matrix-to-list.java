import java.util.*;

class Solution {
    public List<List<Integer>> solution(int[][] table) {
        int n = table.length;
        List<List<Integer>> answer = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<Integer> next = new ArrayList<>();
            for (int j = 0; j < n; j++) if (table[i][j] == 1) next.add(j);
            answer.add(next);
        }
        return answer;
    }
}
