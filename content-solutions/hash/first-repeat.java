import java.util.*;

class Solution {
    public String solution(String[] names) {
        Set<String> seen = new HashSet<>();
        for (String name : names) {
            if (seen.contains(name)) return name;
            seen.add(name);
        }
        return "";
    }
}
