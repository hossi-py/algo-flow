import java.util.*;

class Solution {
    private final Set<String> made = new HashSet<>();
    private final StringBuilder path = new StringBuilder();
    private int[] cards;
    private boolean[] used;
    private int k;

    void arrange() {
        if (path.length() == k) {
            if (path.charAt(0) != '0') made.add(path.toString());
            return;
        }
        for (int i = 0; i < cards.length; i++) {
            if (!used[i]) {
                used[i] = true;
                path.append(cards[i]);
                arrange();
                path.deleteCharAt(path.length() - 1);
                used[i] = false;
            }
        }
    }

    public int solution(int[] cards, int k) {
        this.cards = cards;
        this.k = k;
        used = new boolean[cards.length];
        arrange();
        return made.size();
    }
}
