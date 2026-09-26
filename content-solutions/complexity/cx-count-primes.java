import java.util.*;

class Solution {
    public int solution(int n) {
        if (n < 2) return 0;
        boolean[] composite = new boolean[n + 1];
        int count = 0;
        for (int i = 2; i <= n; i++) {
            if (composite[i]) continue;
            count++;
            for (long j = (long) i * i; j <= n; j += i) composite[(int) j] = true;
        }
        return count;
    }
}
