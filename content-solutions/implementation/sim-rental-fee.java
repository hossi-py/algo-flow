import java.util.*;

class Solution {
    public int[] solution(String[] records, int[] fees) {
        Map<String, Integer> start = new HashMap<>();
        TreeMap<String, Integer> total = new TreeMap<>();
        for (String rec : records) {
            String[] parts = rec.split(" ");
            String[] hm = parts[0].split(":");
            int minute = Integer.parseInt(hm[0]) * 60 + Integer.parseInt(hm[1]);
            if (parts[2].equals("OUT")) {
                start.put(parts[1], minute);
                total.putIfAbsent(parts[1], 0);
            } else {
                total.merge(parts[1], minute - start.remove(parts[1]), Integer::sum);
            }
        }
        for (Map.Entry<String, Integer> e : start.entrySet()) total.merge(e.getKey(), 1439 - e.getValue(), Integer::sum);
        int[] answer = new int[total.size()];
        int i = 0;
        for (int t : total.values()) {
            answer[i++] = t <= fees[0] ? fees[1] : fees[1] + (t - fees[0] + fees[2] - 1) / fees[2] * fees[3];
        }
        return answer;
    }
}
