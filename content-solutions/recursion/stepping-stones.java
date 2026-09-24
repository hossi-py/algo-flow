import java.util.*;

class Solution {
    private final Map<Integer, Long> memo = new HashMap<>();

    long ways(int k) {
        if (k < 0) return 0;
        if (k == 0) return 1;
        if (!memo.containsKey(k)) memo.put(k, ways(k - 1) + ways(k - 2) + ways(k - 3));
        return memo.get(k);
    }

    public long solution(int n) {
        return ways(n);
    }
}
