import java.util.*;

class Solution {
    public String solution(String time, int minutes) {
        String[] parts = time.split(":");
        int h = Integer.parseInt(parts[0]), m = Integer.parseInt(parts[1]);
        long total = (h * 60L + m + minutes) % 1440;
        return String.format("%02d:%02d", total / 60, total % 60);
    }
}
