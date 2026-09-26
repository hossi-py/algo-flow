import java.util.*;

class Solution {
    public int solution(int[] weights, int k) {
        int[] sorted = weights.clone();
        Arrays.sort(sorted);
        return sorted[sorted.length - k];
    }
}
