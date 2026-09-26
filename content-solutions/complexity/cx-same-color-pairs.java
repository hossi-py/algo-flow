import java.util.*;

class Solution {
    public long solution(int[] colors) {
        int[] count = new int[100];
        for (int c : colors) count[c]++;
        long total = 0;
        for (int c : count) total += (long) c * (c - 1) / 2;
        return total;
    }
}
