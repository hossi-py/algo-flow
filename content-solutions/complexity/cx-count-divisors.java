import java.util.*;

class Solution {
    public int solution(long n) {
        int count = 0;
        for (long i = 1; i * i <= n; i++) {
            if (n % i == 0) count += i * i == n ? 1 : 2;
        }
        return count;
    }
}
