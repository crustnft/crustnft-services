import supertest from 'supertest';
import app from '../../src/app';

const request = supertest(app);
describe('test health check', () => {
  test('should be ok', async () => {
    const response = await request.get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
