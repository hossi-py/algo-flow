import java.util.*;

class Solution {
    public int[] solution(int[] nums) {
        int[] u = Arrays.stream(nums).distinct().sorted().toArray();
        Map<Integer, Integer> rank = new HashMap<>();
        for (int i = 0; i < u.length; i++) rank.put(u[i], i);
        int[] answer = new int[nums.length];
        for (int i = 0; i < nums.length; i++) answer[i] = rank.get(nums[i]);
        return answer;
    }
}
