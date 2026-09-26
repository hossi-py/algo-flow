import java.util.*;

class Solution {
    int firstDigit(String name) {
        int k = 0;
        while (!Character.isDigit(name.charAt(k))) k++;
        return k;
    }

    public String[] solution(String[] files) {
        String[] answer = files.clone();
        Arrays.sort(answer, (a, b) -> {
            int ka = firstDigit(a), kb = firstDigit(b);
            int c = a.substring(0, ka).toLowerCase().compareTo(b.substring(0, kb).toLowerCase());
            if (c != 0) return c;
            return Integer.compare(Integer.parseInt(a.substring(ka)), Integer.parseInt(b.substring(kb)));
        });
        return answer;
    }
}
