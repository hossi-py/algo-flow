import java.util.*;

class Solution {
    public long[] solution(int[][] queries) {
        long[] answer = new long[queries.length];
        for (int i = 0; i < queries.length; i++) {
            long a = queries[i][0], b = queries[i][1];
            answer[i] = (a + b) * (b - a + 1) / 2;
        }
        return answer;
    }
}
