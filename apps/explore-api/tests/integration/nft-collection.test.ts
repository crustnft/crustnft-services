import supertest from 'supertest';
import app from '../../src/app';
import { createNftCollectionRequestBodyFixture } from '../../src/__mocks__/nft-collection';
import { generateToken } from '../helper';

const mockFindOne = jest.fn();
const mockCreateNftCollection = jest.fn();
jest.mock('../../src/endpoints/nft-collections/service', () => ({
  validateImageIds: jest.fn(),
  findOne: jest.fn().mockImplementation(() => mockFindOne()),
  createNftCollection: jest
    .fn()
    .mockImplementation((dto) => mockCreateNftCollection(dto)),
}));
const request = supertest(app);

describe('test authentication', () => {
  const token = generateToken();
  test('should return error on validation', async () => {
    const response = await request
      .post('/api/v1/ntf-collections')
      .send({ account: 'invalid-account' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  test('should call method to create a new nft generator', async () => {
    const response = await request
      .post('/api/v1/ntf-collections')
      .send(createNftCollectionRequestBodyFixture)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(mockCreateNftCollection).toBeCalledWith(
      createNftCollectionRequestBodyFixture
    );
  });

  test('should return an nft-generator status ', async () => {
    mockFindOne.mockResolvedValue({
      id: 'ntf-generator-id',
      'mock-object': 'ok',
      creator: process.env.ACCOUNT,
    });

    const response = await request
      .get('/api/v1/ntf-collections/ntf-generator-id')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toEqual({
      id: 'ntf-generator-id',
      'mock-object': 'ok',
      creator: process.env.ACCOUNT,
    });
  });
});
