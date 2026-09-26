class Solution {
    public int solution(int[] gas, int[] cost) {
        long total = 0;
        for (int i = 0; i < gas.length; i++) total += gas[i] - cost[i];
        if (total < 0) return -1;
        int start = 0;
        long tank = 0;
        for (int i = 0; i < gas.length; i++) {
            tank += gas[i] - cost[i];
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return start;
    }
}
