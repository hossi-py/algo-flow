import java.util.*;

class Solution {
    public int[] solution(String commands) {
        int x = 0, y = 0;
        for (char ch : commands.toCharArray()) {
            if (ch == 'U') y++;
            else if (ch == 'D') y--;
            else if (ch == 'L') x--;
            else x++;
        }
        return new int[] {x, y};
    }
}
