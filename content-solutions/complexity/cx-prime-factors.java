import java.util.*;

class Solution {
    public List<Long> solution(long n) {
        List<Long> factors = new ArrayList<>();
        for (long i = 2; i * i <= n; i++) {
            while (n % i == 0) {
                factors.add(i);
                n /= i;
            }
        }
        if (n > 1) factors.add(n);
        return factors;
    }
}
