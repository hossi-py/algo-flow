import java.util.*;

class Solution {
    public long solution(int[] heights, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        long answer = 0;
        for (int x : heights) {
            if (k == 0) answer += count.getOrDefault(x, 0);
            else answer += count.getOrDefault(x - k, 0) + count.getOrDefault(x + k, 0);
            count.put(x, count.getOrDefault(x, 0) + 1);
        }
        return answer;
    }
}
