import java.util.*;

class Solution {
    private int[] weights;
    private int limit;

    int go(int start, int total) {
        int count = 0;
        for (int i = start; i < weights.length; i++) {
            int w = total + weights[i];
            if (w > limit) break;
            if (w == limit) count++;
            else count += go(i + 1, w);
        }
        return count;
    }

    public int solution(int[] weights, int limit) {
        this.weights = weights.clone();
        Arrays.sort(this.weights);
        this.limit = limit;
        return go(0, 0);
    }
}
