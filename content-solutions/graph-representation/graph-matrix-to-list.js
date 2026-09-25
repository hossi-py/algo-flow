function solution(table) {
  return table.map((row) => {
    const next = [];
    row.forEach((value, j) => {
      if (value === 1) next.push(j);
    });
    return next;
  });
}
