class Solution {
    public int solution(int[] weights, int[] values, int limit) {
        int[] best = new int[limit + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = limit; w >= weights[i]; w--) {
                best[w] = Math.max(best[w], best[w - weights[i]] + values[i]);
            }
        }
        return best[limit];
    }
}
