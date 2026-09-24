import java.util.*;

class Solution {
    private final Map<Integer, Long> memo = new HashMap<>();

    long rabbits(int n) {
        if (n <= 2) return 1;
        if (memo.containsKey(n)) return memo.get(n);
        long value = rabbits(n - 1) + rabbits(n - 2);
        memo.put(n, value);
        return value;
    }

    public long solution(int n) {
        return rabbits(n);
    }
}
