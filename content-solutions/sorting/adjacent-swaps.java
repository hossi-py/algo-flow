class Solution {
    public int solution(int[] heights) {
        int[] a = heights.clone();
        int swaps = 0;
        for (int i = 1; i < a.length; i++) {
            for (int j = i; j > 0 && a[j - 1] > a[j]; j--) {
                int t = a[j - 1];
                a[j - 1] = a[j];
                a[j] = t;
                swaps++;
            }
        }
        return swaps;
    }
}
