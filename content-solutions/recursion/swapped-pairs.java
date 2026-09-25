import java.util.*;

class Solution {
    private long swaps = 0;

    int[] sort(int[] a) {
        if (a.length <= 1) return a;
        int mid = a.length / 2;
        int[] left = sort(Arrays.copyOfRange(a, 0, mid));
        int[] right = sort(Arrays.copyOfRange(a, mid, a.length));
        int[] merged = new int[a.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) merged[k++] = left[i++];
            else {
                merged[k++] = right[j++];
                swaps += left.length - i;
            }
        }
        while (i < left.length) merged[k++] = left[i++];
        while (j < right.length) merged[k++] = right[j++];
        return merged;
    }

    public long solution(int[] heights) {
        sort(heights);
        return swaps;
    }
}
