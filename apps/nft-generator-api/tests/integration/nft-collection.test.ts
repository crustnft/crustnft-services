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
    expect(response.body).toEqual({
      error: {
        details: [
          { message: '"medias" is required', path: ['medias'] },
          { message: '"account" is not allowed', path: ['account'] },
        ],
        message: 'BadRequestError',
      },
    });
  });

  test('should call method to create a new nft generator', async () => {
    const response = await request
      .post('/api/v1/ntf-collections')
      .send({
        medias: [
          {
            category: 'background',
            mediaId: '1',
          },
        ],
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(mockCreateNftGenerator).toBeCalledWith({
      medias: [
        {
          category: 'background',
          mediaId: '1',
        },
      ],
    });
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
