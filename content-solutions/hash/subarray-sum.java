import java.util.*;

class Solution {
    public int solution(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);
        int total = 0;
        int answer = 0;
        for (int x : nums) {
            total += x;
            answer += seen.getOrDefault(total - k, 0);
            seen.put(total, seen.getOrDefault(total, 0) + 1);
        }
        return answer;
    }
}
