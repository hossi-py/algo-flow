import java.util.*;

class Solution {
    public List<List<Integer>> solution(int[] parent) {
        List<List<Integer>> children = new ArrayList<>();
        for (int i = 0; i < parent.length; i++) children.add(new ArrayList<>());
        for (int i = 0; i < parent.length; i++) {
            if (parent[i] != -1) children.get(parent[i]).add(i);
        }
        return children;
    }
}
