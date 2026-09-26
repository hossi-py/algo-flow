import java.util.*;

class Solution {
    public long[] solution(int[] nums, int[][] queries) {
        long[] prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
        long[] answer = new long[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int l = queries[i][0], r = queries[i][1];
            answer[i] = prefix[r + 1] - prefix[l];
        }
        return answer;
    }
}
