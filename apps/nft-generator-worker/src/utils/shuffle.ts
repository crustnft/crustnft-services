export default function shuffle<T>(array: T[]) {
  // https://stackoverflow.com/a/2450976/1681903
  let currentIndex = array.length;
  let randomIndex = 0;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
