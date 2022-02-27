import app from '../../src/app';
import { createMockServer } from '../helper';

const request = createMockServer(app);
describe('test health check', () => {
  test('should be ok', async () => {
    const response = await request.get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
