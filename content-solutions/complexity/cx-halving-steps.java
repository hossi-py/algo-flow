import java.util.*;

class Solution {
    public int solution(long n) {
        int steps = 0;
        while (n > 1) {
            n /= 2;
            steps++;
        }
        return steps;
    }
}
