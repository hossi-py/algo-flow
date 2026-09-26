import java.util.*;

class Solution {
    public String[] solution(String[] names, int[] scores, int[] times) {
        Integer[] order = new Integer[names.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, Comparator
            .comparingInt((Integer i) -> -scores[i])
            .thenComparingInt(i -> times[i])
            .thenComparing(i -> names[i]));
        String[] answer = new String[names.length];
        for (int i = 0; i < order.length; i++) answer[i] = names[order[i]];
        return answer;
    }
}
