import java.util.*;

class Solution {
    public int solution(int[] weights, int limit) {
        int[] w = weights.clone();
        Arrays.sort(w);
        int i = 0, j = w.length - 1, rafts = 0;
        while (i <= j) {
            if (w[i] + w[j] <= limit) i++;
            j--;
            rafts++;
        }
        return rafts;
    }
}
