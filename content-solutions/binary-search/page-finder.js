function solution(books, queries) {
  const find = (x) => {
    let lo = 0;
    let hi = books.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (books[mid] === x) return mid;
      if (books[mid] < x) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  };
  return queries.map(find);
}
