function solution(nums, queries) {
  const prefix = [0];
  for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
}
