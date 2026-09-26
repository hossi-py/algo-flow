import java.util.*;

class Solution {
    public long solution(int[] scores) {
        int n = scores.length;
        long[] candy = new long[n];
        Arrays.fill(candy, 1);
        for (int i = 1; i < n; i++) {
            if (scores[i] > scores[i - 1]) candy[i] = candy[i - 1] + 1;
        }
        for (int i = n - 2; i >= 0; i--) {
            if (scores[i] > scores[i + 1]) candy[i] = Math.max(candy[i], candy[i + 1] + 1);
        }
        long total = 0;
        for (long c : candy) total += c;
        return total;
    }
}
