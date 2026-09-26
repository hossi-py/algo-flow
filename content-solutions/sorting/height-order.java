import java.util.*;

class Solution {
    public int[] solution(int[] heights) {
        Integer[] order = new Integer[heights.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> heights[a] != heights[b] ? heights[a] - heights[b] : a - b);
        int[] answer = new int[order.length];
        for (int i = 0; i < order.length; i++) answer[i] = order[i];
        return answer;
    }
}
