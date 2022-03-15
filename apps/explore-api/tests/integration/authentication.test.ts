import app from '../../src/app';
import * as chainService from '../../src/services/chain-service';
import { createMockServer } from '../helper';

const mockFindById = jest.fn();
jest.mock('../../src/endpoints/users/service', () => ({
  update: jest.fn(),
  findById: jest.fn().mockImplementation(() => mockFindById()),
}));

const verifySignatureSpy = jest.spyOn(chainService, 'verifySignature');

const { ACCOUNT } = process.env;
const request = createMockServer(app);

describe('test authentication', () => {
  test('should return 400 for invalid account', async () => {
    const response = await request
      .post('/api/v1/authentication/challenge-login')
      .send({ account: 'invalid-account' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
  });

  test('should return a body with account ', async () => {
    const response = await request
      .post('/api/v1/authentication/challenge-login')
      .send({ account: ACCOUNT })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.data).toContain(ACCOUNT);
  });

  test('should return a jwt token', async () => {
    verifySignatureSpy.mockImplementation(() => true);
    mockFindById.mockResolvedValue({
      nonce: 123123,
      account: ACCOUNT,
    });
    const response = await request
      .post('/api/v1/authentication/login')
      .send({ account: ACCOUNT, signature: 'mock-signed' })
      .set('Accept', 'application/json');

    const jwt = response.body.data;
    console.log('jwt secret: ', process.env.JWT_SECRET);
    console.log('jwt: ', jwt);
    const jwtBody = jwt.split('.')[1];
    const jsonPayload = JSON.parse(Buffer.from(jwtBody, 'base64').toString());

    expect(response.status).toBe(200);
    expect(jsonPayload).toMatchObject({ account: ACCOUNT });
  });
});
