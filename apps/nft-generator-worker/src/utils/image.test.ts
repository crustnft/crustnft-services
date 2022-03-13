import { getFitSize } from './image';

describe('image ', () => {
  const preferHeight = 1500;
  const preferWidth = 1000;

  test('same ratio', () => {
    expect(getFitSize(preferHeight, preferWidth, 3000, 1500)).toEqual({
      height: 1500,
      width: 750,
    });

    expect(getFitSize(preferHeight, preferWidth, 60, 30)).toEqual({
      height: 1500,
      width: 750,
    });
  });

  test('prefer ratio is bigger', () => {
    expect(getFitSize(preferHeight, preferWidth, 14, 10)).toEqual({
      height: 1400,
      width: 1000,
    });

    expect(getFitSize(preferHeight, preferWidth, 14000, 10000)).toEqual({
      height: 1400,
      width: 1000,
    });
  });

  test('prefer ratio is smaller', () => {
    expect(getFitSize(preferHeight, preferWidth, 40, 20)).toEqual({
      height: 1500,
      width: 750,
    });

    expect(getFitSize(preferHeight, preferWidth, 400, 20)).toEqual({
      height: 1500,
      width: 75,
    });

    expect(getFitSize(preferHeight, preferWidth, 40000, 2000)).toEqual({
      height: 1500,
      width: 75,
    });

    expect(getFitSize(preferHeight, preferWidth, 4000, 200)).toEqual({
      height: 1500,
      width: 75,
    });
  });

  test('prefer ratio is smaller', () => {
    expect(getFitSize(2500, 2000, 404, 618)).toEqual({
      height: 1308,
      width: 2000,
    });

    expect(getFitSize(2500, 2000, 480, 480)).toEqual({
      height: 2001,
      width: 2000,
    });
  });
});
