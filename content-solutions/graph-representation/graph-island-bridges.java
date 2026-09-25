class Solution {
    public int solution(int[][] neighbors) {
        int total = 0;
        for (int[] islands : neighbors) total += islands.length;
        return total / 2;
    }
}
