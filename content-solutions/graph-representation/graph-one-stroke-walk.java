class Solution {
    public boolean solution(int n, int[][] trails) {
        int[] degree = new int[n];
        for (int[] t : trails) {
            degree[t[0]]++;
            degree[t[1]]++;
        }
        int odd = 0;
        for (int d : degree) if (d % 2 == 1) odd++;
        return odd == 0 || odd == 2;
    }
}
