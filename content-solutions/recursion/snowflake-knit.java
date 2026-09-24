import java.util.*;

class Solution {
    List<String> pattern(int k) {
        if (k == 0) return List.of("*");
        List<String> small = pattern(k - 1);
        String blank = " ".repeat(small.size());
        List<String> result = new ArrayList<>();
        for (String row : small) result.add(row.repeat(3));
        for (String row : small) result.add(row + blank + row);
        for (String row : small) result.add(row.repeat(3));
        return result;
    }

    public List<String> solution(int k) {
        return pattern(k);
    }
}
