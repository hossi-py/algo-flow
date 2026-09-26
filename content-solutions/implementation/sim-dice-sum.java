import java.util.*;

class Solution {
    public int solution(String commands) {
        int top = 1, bottom = 6, north = 2, south = 5, east = 3, west = 4;
        int total = 0;
        for (char ch : commands.toCharArray()) {
            int t = top;
            if (ch == 'E') {
                top = west;
                west = bottom;
                bottom = east;
                east = t;
            } else if (ch == 'W') {
                top = east;
                east = bottom;
                bottom = west;
                west = t;
            } else if (ch == 'N') {
                top = south;
                south = bottom;
                bottom = north;
                north = t;
            } else {
                top = north;
                north = bottom;
                bottom = south;
                south = t;
            }
            total += top;
        }
        return total;
    }
}
