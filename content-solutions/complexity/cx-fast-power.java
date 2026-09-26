import java.util.*;

class Solution {
    public long solution(long a, long b, long m) {
        long result = 1 % m, base = a % m;
        while (b > 0) {
            if (b % 2 == 1) result = result * base % m;
            base = base * base % m;
            b /= 2;
        }
        return result;
    }
}
