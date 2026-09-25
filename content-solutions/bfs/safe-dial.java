import java.util.*;

class Solution {
    public int solution(String target, String[] jammed) {
        Set<String> blocked = new HashSet<>(Arrays.asList(jammed));
        if (blocked.contains("0000")) return -1;
        Map<String, Integer> dist = new HashMap<>();
        dist.put("0000", 0);
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("0000");
        while (!queue.isEmpty()) {
            String s = queue.poll();
            if (s.equals(target)) return dist.get(s);
            for (int i = 0; i < 4; i++) {
                for (int d : new int[] {1, 9}) {
                    int digit = (s.charAt(i) - '0' + d) % 10;
                    String t = s.substring(0, i) + digit + s.substring(i + 1);
                    if (!blocked.contains(t) && !dist.containsKey(t)) {
                        dist.put(t, dist.get(s) + 1);
                        queue.offer(t);
                    }
                }
            }
        }
        return -1;
    }
}
