class Solution {
    public int solution(int[] scores, int k, int threshold) {
        long need = (long) threshold * k;
        long window = 0;
        for (int i = 0; i < k; i++) window += scores[i];
        int count = window >= need ? 1 : 0;
        for (int i = k; i < scores.length; i++) {
            window += scores[i] - scores[i - k];
            if (window >= need) count++;
        }
        return count;
    }
}
