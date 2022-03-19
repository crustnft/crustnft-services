export const createNftCollectionRequestBodyFixture = {
  images: [
    {
      name: 'background',
      id: 'd1199842-d735-4b2f-9a78-f4f80e81df4f',
    },
    {
      name: 'head1',
      id: '8383ffa8-51c8-4b75-9214-fcfe31d7127c',
    },
    {
      name: 'head',
      id: 'giphy2.webp',
    },
    {
      name: 'head',
      id: 'giphy3.gif',
    },
    {
      name: 'ok goat',
      id: 'nb3.png',
    },
    {
      name: 'random',
      id: 'nbhh.png',
    },
  ],
  layers: [
    {
      id: 'IDLayer1',
      name: 'Background',
      imageIds: ['d1199842-d735-4b2f-9a78-f4f80e81df4f', 'giphy2.webp'],
    },
    {
      id: 'IDLayer2',
      name: 'Costume 1',
      imageIds: ['8383ffa8-51c8-4b75-9214-fcfe31d7127c', 'giphy3.gif'],
    },
    {
      id: 'IDLayer3',
      name: 'Costume 2',
      imageIds: ['nb3.png', 'nbhh.png'],
    },
  ],
  name: 'hello-toro-4444',
  description: 'hello-toro-2',
  layerOrder: ['IDLayer1', 'IDLayer2', 'IDLayer3'],
};
