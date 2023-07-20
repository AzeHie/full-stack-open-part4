const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('get requests', () => {
  test('of blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(2);
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});