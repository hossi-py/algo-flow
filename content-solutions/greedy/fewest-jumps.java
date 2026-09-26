class Solution {
    public int solution(int[] jumps) {
        int count = 0, end = 0, far = 0;
        for (int i = 0; i < jumps.length - 1; i++) {
            far = Math.max(far, i + jumps[i]);
            if (i == end) {
                count++;
                end = far;
            }
        }
        return count;
    }
}
