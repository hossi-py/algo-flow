import java.util.*;

class Solution {
    private final List<List<String>> result = new ArrayList<>();
    private final List<String> path = new ArrayList<>();
    private String[][] closet;

    void choose(int i) {
        if (i == closet.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (String item : closet[i]) {
            path.add(item);
            choose(i + 1);
            path.remove(path.size() - 1);
        }
    }

    public List<List<String>> solution(String[][] closet) {
        this.closet = closet;
        choose(0);
        return result;
    }
}
