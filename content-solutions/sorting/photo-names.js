function solution(files) {
  const split = (name) => {
    const k = name.search(/[0-9]/);
    return [name.slice(0, k).toLowerCase(), Number(name.slice(k))];
  };
  return [...files].sort((a, b) => {
    const [ha, na] = split(a);
    const [hb, nb] = split(b);
    if (ha !== hb) return ha < hb ? -1 : 1;
    return na - nb;
  });
}
