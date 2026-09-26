import java.util.*;

class Solution {
    boolean isLeap(int y) {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }

    int monthDays(int y, int m) {
        if (m == 2) return isLeap(y) ? 29 : 28;
        return (m == 4 || m == 6 || m == 9 || m == 11) ? 30 : 31;
    }

    public String solution(String date, int days) {
        String[] p = date.split("-");
        int y = Integer.parseInt(p[0]), m = Integer.parseInt(p[1]), d = Integer.parseInt(p[2]);
        long day = d - 1 + (long) days;
        for (int k = 1; k < m; k++) day += monthDays(y, k);
        while (day >= (isLeap(y) ? 366 : 365)) {
            day -= isLeap(y) ? 366 : 365;
            y++;
        }
        m = 1;
        while (day >= monthDays(y, m)) {
            day -= monthDays(y, m);
            m++;
        }
        return String.format("%04d-%02d-%02d", y, m, day + 1);
    }
}
