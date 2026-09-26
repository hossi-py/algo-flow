import java.util.*;

class Solution {
    public int solution(int[] coins, int amount) {
        final int INF = Integer.MAX_VALUE;
        int[] fewest = new int[amount + 1];
        Arrays.fill(fewest, INF);
        fewest[0] = 0;
        for (int c : coins) {
            for (int a = c; a <= amount; a++) {
                if (fewest[a - c] != INF) fewest[a] = Math.min(fewest[a], fewest[a - c] + 1);
            }
        }
        return fewest[amount] == INF ? -1 : fewest[amount];
    }
}
