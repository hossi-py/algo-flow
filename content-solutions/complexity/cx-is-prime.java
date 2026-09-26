import java.util.*;

class Solution {
    public String solution(long n) {
        if (n < 2) return "NO";
        for (long i = 2; i * i <= n; i++) {
            if (n % i == 0) return "NO";
        }
        return "YES";
    }
}
