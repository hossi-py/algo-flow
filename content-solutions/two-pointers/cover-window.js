function solution(street, recipe) {
  const need = Array(26).fill(0);
  for (const c of recipe) need[c.charCodeAt(0) - 97]++;
  let missing = recipe.length;
  let l = 0;
  let best = Infinity;
  for (let r = 0; r < street.length; r++) {
    const c = street.charCodeAt(r) - 97;
    if (need[c] > 0) missing--;
    need[c]--;
    while (missing === 0) {
      best = Math.min(best, r - l + 1);
      const left = street.charCodeAt(l) - 97;
      need[left]++;
      if (need[left] > 0) missing++;
      l++;
    }
  }
  return best === Infinity ? 0 : best;
}
