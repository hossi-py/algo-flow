import java.util.*;

class Solution {
    public int solution(int[] coins, int amount) {
        int[] sorted = coins.clone();
        Arrays.sort(sorted);
        int count = 0;
        for (int i = sorted.length - 1; i >= 0; i--) {
            count += amount / sorted[i];
            amount %= sorted[i];
        }
        return count;
    }
}
