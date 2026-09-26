class Solution {
    public boolean solution(String note) {
        int l = 0, r = note.length() - 1;
        while (l < r) {
            char a = note.charAt(l), b = note.charAt(r);
            if (!Character.isLetterOrDigit(a)) l++;
            else if (!Character.isLetterOrDigit(b)) r--;
            else if (Character.toLowerCase(a) != Character.toLowerCase(b)) return false;
            else {
                l++;
                r--;
            }
        }
        return true;
    }
}
