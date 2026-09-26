import java.util.*;

class Solution {
    public List<Integer> solution(int n, int[] stickers) {
        Set<Integer> have = new HashSet<>();
        for (int s : stickers) have.add(s);
        List<Integer> answer = new ArrayList<>();
        for (int k = 1; k <= n; k++) {
            if (!have.contains(k)) answer.add(k);
        }
        return answer;
    }
}
