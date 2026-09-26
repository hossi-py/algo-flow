import java.util.*;

class Solution {
    public int solution(int[] nums, int target) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int n = a.length;
        int best = a[0] + a[1] + a[2];
        for (int i = 0; i < n - 2; i++) {
            int l = i + 1, r = n - 1;
            while (l < r) {
                int s = a[i] + a[l] + a[r];
                int d = Math.abs(s - target), bd = Math.abs(best - target);
                if (d < bd || (d == bd && s < best)) best = s;
                if (s < target) l++;
                else if (s > target) r--;
                else return s;
            }
        }
        return best;
    }
}
