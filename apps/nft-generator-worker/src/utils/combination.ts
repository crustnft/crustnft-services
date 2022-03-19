import { Layer } from '@crustnft-explore/data-access';

export function combine(layers: Layer[]) {
  const combined = [];
  combineRecursiveImpl(combined, undefined, layers, 0);
  return combined;
}

function combineRecursiveImpl(
  result: string[],
  text: string,
  layers: Layer[],
  index: number
) {
  if (index === layers.length) {
    return result.push(text);
  }
  for (let i = 0; i < layers[index].imageIds.length; i++) {
    combineRecursiveImpl(
      result,
      text ? `${text};${i}` : `${i}`,
      layers,
      index + 1
    );
  }
}
