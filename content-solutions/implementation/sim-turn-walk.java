import java.util.*;

class Solution {
    static final int[] DX = {0, 1, 0, -1};
    static final int[] DY = {1, 0, -1, 0};

    public int[] solution(String commands) {
        int x = 0, y = 0, d = 0;
        for (char ch : commands.toCharArray()) {
            if (ch == 'L') d = (d + 3) % 4;
            else if (ch == 'R') d = (d + 1) % 4;
            else {
                x += DX[d];
                y += DY[d];
            }
        }
        return new int[] {x, y};
    }
}
