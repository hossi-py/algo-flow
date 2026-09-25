import java.util.*;

class Solution {
    private final List<List<String>> result = new ArrayList<>();
    private final List<String> path = new ArrayList<>();
    private String[] names;
    private boolean[] used;

    void place() {
        if (path.size() == names.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < names.length; i++) {
            if (!used[i]) {
                used[i] = true;
                path.add(names[i]);
                place();
                path.remove(path.size() - 1);
                used[i] = false;
            }
        }
    }

    public List<List<String>> solution(String[] names) {
        this.names = names;
        used = new boolean[names.length];
        place();
        return result;
    }
}
