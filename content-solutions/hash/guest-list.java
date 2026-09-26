import java.util.*;

class Solution {
    public boolean[] solution(String[] invited, String[] arrivals) {
        Set<String> invitedSet = new HashSet<>(Arrays.asList(invited));
        boolean[] answer = new boolean[arrivals.length];
        for (int i = 0; i < arrivals.length; i++) {
            answer[i] = invitedSet.contains(arrivals[i]);
        }
        return answer;
    }
}
