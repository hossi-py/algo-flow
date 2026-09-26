import java.util.*;

class Solution {
    public List<String> solution(String[] words) {
        List<String> answer = new ArrayList<>(new HashSet<>(Arrays.asList(words)));
        answer.sort(Comparator.comparingInt(String::length).thenComparing(w -> w));
        return answer;
    }
}
