export default function createPermutation(items: number[]) {
  if (!items.length) return [[]];

  return items.flatMap((item, index) => {
    return createPermutation([
      ...items.slice(0, index),
      ...items.slice(index + 1),
    ]).map((vs) => [item, ...vs]);
  });
}
