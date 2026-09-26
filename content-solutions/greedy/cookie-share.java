import java.util.*;

class Solution {
    public int solution(int[] greed, int[] cookies) {
        int[] g = greed.clone();
        int[] c = cookies.clone();
        Arrays.sort(g);
        Arrays.sort(c);
        int i = 0;
        for (int size : c) {
            if (i < g.length && size >= g[i]) i++;
        }
        return i;
    }
}
