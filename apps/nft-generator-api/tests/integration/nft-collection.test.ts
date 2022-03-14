import supertest from 'supertest';
import app from '../../src/app';

jest.mock('@crustnft-explore/util-config-api', () => {
  const actualModule = jest.requireActual('@crustnft-explore/util-config-api');
  return {
    ...actualModule,
    checkAuthentication: jest.fn().mockImplementation(() => {
      return function (req, res, next) {
        return next();
      };
    }),
  };
});

const mockFindOne = jest.fn();
const mockCreateNftGenerator = jest.fn();
jest.mock('../../src/endpoints/nft-collections/service', () => ({
  findOne: jest.fn().mockImplementation(() => mockFindOne()),
  createNftGenerator: jest
    .fn()
    .mockImplementation((dto) => mockCreateNftGenerator(dto)),
}));
const request = supertest(app);

describe('test authentication', () => {
  test('should return error on validation', async () => {
    const response = await request
      .post('/api/v1/ntf-collections')
      .send({ account: 'invalid-account' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
  });

  test('should call method to create a new nft generator', async () => {
    const payload = {
      images: [
        {
          id: 'd1199842-d735-4b2f-9a78-f4f80e81df4f',
          name: 'background',
        },
        {
          id: '8383ffa8-51c8-4b75-9214-fcfe31d7127c',
          name: 'head1',
        },
        {
          id: 'giphy2.webp',
          name: 'head',
        },
        {
          id: 'giphy3.gif',
          name: 'head',
        },
      ],
      layers: [
        {
          name: 'Background',
          imageIds: ['d1199842-d735-4b2f-9a78-f4f80e81df4f', 'giphy2.webp'],
          id: 'IDLayer1',
        },
        {
          imageIds: ['8383ffa8-51c8-4b75-9214-fcfe31d7127c', 'giphy3.gif'],
          id: 'IDLayer2',
          name: 'Costume',
        },
      ],
      layerOrder: ['IDLayer1', 'IDLayer2'],
      description: 'hello-toro333',
      name: 'hello-toro3339',
    };

    const response = await request
      .post('/api/v1/ntf-collections')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(mockCreateNftGenerator).toBeCalledWith(payload);
  });

  test('should return an nft-generator status ', async () => {
    mockFindOne.mockResolvedValue({
      id: 'ntf-generator-id',
      'mock-object': 'ok',
    });
    const response = await request
      .get('/api/v1/ntf-collections/ntf-generator-id')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      id: 'ntf-generator-id',
      'mock-object': 'ok',
    });
  });
});
