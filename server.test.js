// filepath: c:\Users\kmanc\imageGenerator\server.test.js
const request = require('supertest');
const app = require('./server');

describe('POST /generate-image', () => {
  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/generate-image')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Prompt is required');
  });
});