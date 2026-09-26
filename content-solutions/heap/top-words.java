import java.util.*;

class Solution {
    public List<String> solution(String[] words, int k) {
        Map<String, Integer> count = new HashMap<>();
        for (String w : words) count.put(w, count.getOrDefault(w, 0) + 1);
        PriorityQueue<String> h = new PriorityQueue<>((a, b) -> {
            int ca = count.get(a), cb = count.get(b);
            return ca != cb ? cb - ca : a.compareTo(b);
        });
        h.addAll(count.keySet());
        List<String> answer = new ArrayList<>();
        for (int i = 0; i < k; i++) answer.add(h.poll());
        return answer;
    }
}
